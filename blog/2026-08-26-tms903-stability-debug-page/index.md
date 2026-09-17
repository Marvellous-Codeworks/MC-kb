---
slug: tms903-stability-debug-page
title: "9.0.3 in progress: chasing down a crash in TMS's own debug tooling"
description: "A live crash report led to a first, real round of fixes in TMS's log buffer and debug page, and then the crash kept happening anyway. Tracing it further uncovered the actual mechanism: a chrome.storage broadcast quietly duplicating megabytes of log data across every suspended tab, fixed by moving the whole log buffer to IndexedDB."
date: 2026-08-26T15:40:00+01:00
authors: [gioxx]
tags: [tms, bug]
---

TMS's debug page has an optional **captureLogs** toggle for exactly one purpose: when something goes wrong, turn it on, reproduce the issue, and send us the report. It is meant to make diagnosing problems easier, not to become the problem itself.

A few days ago, while stress-testing 9.0.3 in development with dozens of suspended tabs open and `captureLogs` enabled, the opposite happened: the extension itself crashed, memory exhausted, requiring a full reload to recover. That is not an acceptable outcome for a tool whose entire job is to run quietly in the background and get out of the way, let alone for an extension whose whole purpose is to lighten Chrome's memory load in the first place. What follows is the real, unedited shape of tracking that down: a first round of fixes that were genuinely necessary and genuinely not enough, followed by the investigation that found what actually needed fixing.

:::tip[TL;DR]
- Stress-testing 9.0.3 in development, with lots of suspended tabs and TMS's `captureLogs` debug option on, hit a real out-of-memory crash.
- We fixed several genuine bugs in the log buffer and debug page (PR #472), and the crash kept happening anyway.
- The actual cause: TMS's log storage was quietly sending a copy of itself to *every open suspended tab* every time it was written, and none of those copies ever got cleaned up. The more you logged, the faster it filled up your memory, regardless of how many tabs you had open.
- The real fix moves that log storage to a different, safer mechanism (IndexedDB) that doesn't have this problem at all, plus a batch of smaller hardening fixes found along the way (PR #473, in progress).
- **Affects only people who turn on `captureLogs`** to help us debug something. If you've never touched that setting, none of this ever affected you.
:::

{/* truncate */}

## Starting from a real report, not a hypothesis

That crash produced a downloaded debug log, and that log became the map for everything that followed: every fix in this post was found by tracing an actual symptom back to its cause, not by guessing at what might theoretically go wrong.

The short version of what we found first: TMS's log buffer, the piece of code responsible for collecting diagnostic entries so `captureLogs` reports are useful, had accumulated several real memory and correctness bugs of its own. On top of that, the debug page's own tab-status checker had a design gap that made "unknown" tab statuses effectively permanent, and a runaway event handler that could multiply its own workload without bound.

None of this affects a normal TMS install with `captureLogs` off. But if you are the kind of user who leaves it on to help us track down a hard-to-reproduce issue, and you run TMS the way it is meant to be run, with a lot of tabs open, these are exactly the conditions that exposed every one of these bugs. They were real, they were fixed, and, as it turned out, they were not the whole story.

## Round one: the log buffer's duplicated memory, unbounded growth, and a crash under load

TMS's `gsUtils.js` module is imported by every page in the extension, the background service worker, every open settings page, and, critically, **every single suspended tab**. Each of those contexts used to keep its own in-memory copy of the recent log history, up to 10,000 entries, even though nothing ever read that copy back except the debug page itself (which reads straight from storage instead). With fifty suspended tabs open, that is fifty redundant buffers sitting in memory for no reason. Removed entirely.

The more serious issue was what happened when the service worker briefly lost contact with a suspended tab, or vice versa, which happens routinely as Chrome recycles the service worker to save memory. A failed log delivery got queued for retry, but nothing ever capped how large that retry queue could grow. Under sustained logging with `captureLogs` on, that queue could grow without limit until Chrome killed the page for memory pressure, which matched the "insufficient memory, extension disabled" report almost exactly. It was capped at 5,000 entries, oldest dropped first.

Fixing that surfaced the next problem: a burst of near-simultaneous log writes, for example every suspended tab reacting at once to `captureLogs` being toggled, meant dozens of full-buffer read-modify-write round trips to `chrome.storage.local` back to back. `chrome.storage.local` has no append primitive, every single log entry cost a full get-parse-stringify-set of the *entire* stored history. With ~50 tabs open, this alone was enough to make the extension noticeably sluggish, including pages unrelated to logging that just happened to be loading at the same time. Incoming log messages were coalesced into a single merge every 250ms instead of one merge per message, turning a fifty-tab burst into one round trip.

That coalescing change itself then introduced a genuine crash: if many contexts had each queued up their own maximum backlog while the service worker was briefly unreachable, all of them flushing at once could aggregate well over 100,000 log entries into a single batch. The code merging that batch into storage used JavaScript's spread operator (`array.push(...entries)`) to append it, and V8 throws a hard `RangeError` past a few tens of thousands of spread arguments. That failure caused every sender to requeue its batch, which reproduced the exact same oversized merge on the next attempt, forever, a real, repeatable crash that lined up precisely with the original report. Switched to `concat()`, which has no such limit, and added a hard cap on the aggregated batch itself so it could never grow that large again.

A few more rounds of testing turned up smaller, subtler correctness issues in the same area: log ordering could get scrambled between a page's batched writes and the service worker's own immediate ones, a corrupted or malformed persisted buffer could get the retry logic stuck trying the same broken write forever, and the "Clear log" button had a narrow race where an in-flight batch could resurrect entries the user had just wiped. Each of those was closed. This whole round of fixes [merged as PR #472](https://github.com/gioxx/MarvellousSuspender/pull/472).

## The debug page: unknown status that never got better

Separately from the log buffer, the debug page's tab profiler kept showing `unknown` for the status of certain tabs, indefinitely, surviving repeated manual reloads of the whole extension.

The cause: when a tab's content script genuinely stops responding (the page itself is still alive, just its script has died, a different failure mode from Chrome discarding a tab to save memory), recovering it requires TMS to re-inject and restart that script. The debug page's status check never attempted that recovery step, it did a single quick probe and gave up. Only the extension's own periodic background check ever did the real recovery work, and that check runs on its own schedule, independent of whatever the debug page happens to be showing you at the time.

The fix routed the debug page's checks through the same recovery-capable queue the background process already uses, instead of a shallow one-off probe, so a tab that needs re-injection actually gets it, and the debug page's own table now patches that row live once the real result comes back instead of leaving it stuck on a stale placeholder.

## An unbounded event handler and an unbounded fan-out

Two more issues, both specific to running with a lot of tabs open at once, also went into PR #472:

The debug page refreshes its tab table whenever the window regains focus. With no guard in place, rapid focus changes (multiple monitors, fast alt-tabbing) could trigger overlapping refreshes, each one repeating a full pass over every open tab. That was debounced to at most one refresh per second, with the in-flight run's result never silently dropped if the tab list changed while it was still running.

And the refresh itself, for every profile with more than a handful of tabs, used to fire one request per tab all at once with no cap, hundreds of simultaneous checks against the background process for a heavily-loaded profile. That was capped to a bounded number in flight at a time, spread out instead of bursting, without blocking the table from rendering while slower checks were still queued behind faster ones.

## The crash that wouldn't die

PR #472 merged. It fixed several real bugs. And going back to actually using TMS, reloading the extension, opening the debug page, browsing the tab list, it crashed again. Not eventually, not under some extreme stress test: within minutes, sometimes on nothing more than opening the debug page and looking around.

That is the point where a smaller team, or a less patient one, stops at "well, we fixed a bunch of real bugs, maybe it's better now" and ships it. We didn't, because the report was specific and reproducible, and specific reproducible reports deserve a specific reproducible answer, not a hopeful one.

The first real break came from `chrome://crashes` and the local Crashpad minidumps Chrome keeps on disk even after uploading them. Reading the crash annotations directly (no symbol server access needed, Crashpad embeds a surprising amount of plain-text diagnostic context in every dump) turned up two numbers that mattered: `view-count`/`web-frame-count` around 48–49, and `loaded-origin-0` pointing at TMS's own extension origin. Chrome puts every page sharing the same extension origin into one renderer process: every open `suspended.html`, plus the debug page itself, all sharing one process, one V8 heap, with a hard ceiling around 4GB regardless of how much physical RAM the machine actually has.

That heap was nearly full: `v8-oom-old-space-size` (regular JS objects) sat at a tiny ~18MB, while `v8-oom-memory-allocator-size` (backing store for large binary buffers) was pinned near the 4GB cap. Two theories followed from that, both genuinely tested, both genuinely fixed, and neither the actual answer:

- **Favicon size.** `gsFavicon.js` built each suspended tab's favicon at the source image's native resolution before scaling anything down, and some sites serve genuinely large "favicons" (a 512×512 apple-touch-icon reused as-is is common). Capped the working canvas to a sane maximum, and, since browsers already suspended before the fix had cached the oversized version, added a version stamp so the cache silently rebuilds at the new size instead of staying oversized forever.
- **The debug page's own `refreshLogs()`.** It re-ran on every window focus event with no protection against overlapping calls, unlike the sibling function that debounces exactly this. Each run re-parsed the entire log buffer, including a full-buffer fetch that existed only to display a count. Fixed to coalesce concurrent calls into at most one in flight.

Both fixes were correct and shipped. Neither stopped the crash. The tell was in the numbers: the same ~3.7–4GB ceiling kept showing up whether 28 suspended tabs were open or 49. If either theory were the real cause, more tabs should have meant more risk. It didn't. Something else was consuming memory at a rate tied to *how often the log buffer was written*, not to how many tabs happened to be open at the moment of the crash.

## The actual mechanism: a broadcast nobody asked for

Static analysis of crash dumps had said everything it could. The next step was live memory profiling: `chrome://inspect`, attached to the shared renderer process, taking heap snapshots at intervals while reproducing the crash, saving each one to disk immediately so a mid-recording crash couldn't take the evidence down with it.

The second snapshot, taken shortly before an actual crash, showed the real shape of the problem directly: dozens of near-duplicate strings, each roughly 6MB, each a full JSON-serialized copy of the log buffer, and their timestamps were **hours old**. Not fresh writes accumulating under load. Frozen, historical copies of the buffer, retained since early in the session, never released.

The mechanism, once we knew what to look for: `chrome.storage.onChanged` fires in *every context that has any listener registered for that storage area*, delivering a full copy of whatever changed, regardless of whether that context's own callback cares about the specific keys involved. `suspended.js` registers exactly such a listener, in every single suspended tab, for one small, entirely unrelated setting. Every time anything wrote to the log buffer (which, with `captureLogs` on, is constantly), Chrome dutifully constructed and delivered a multi-megabyte `oldValue`/`newValue` payload to every one of those listeners, in every suspended tab, all sharing that one renderer process. None of it released once the listener finished ignoring it.

This is not a bug in the sense of a typo or an off-by-one. It is `chrome.storage.onChanged` behaving exactly as documented. The log buffer's design, one shared blob in `chrome.storage.local`, read and written across dozens of contexts, was simply the wrong shape for that API's actual delivery semantics, and the more tabs (and the more logging) a session had, the more that mismatch cost, independent of the specific favicon size or refresh cadence either earlier theory had chased.

## The fix: move the whole log buffer to IndexedDB

The whole persistence layer moved from `chrome.storage.local` to IndexedDB, using the same database TMS already keeps for favicon and session data. Instead of one shared blob, the log buffer is now one record per entry. IndexedDB writes have no cross-context broadcast equivalent to `chrome.storage.onChanged`, and per-entry records mean every context, every suspended tab included, can write directly, without funneling through the service worker as a single designated writer the way the old design required.

A good deal of complexity the old blob-based design needed went away with it: the version-token optimistic-concurrency retry loop that guarded against two writers racing on one shared value, the 250ms incoming-message coalescing window from the earlier round of fixes, and the dedicated cross-context message action that carried log entries to the service worker in the first place. None of it is needed when every writer can safely touch its own record.

## What review caught along the way

Several rounds of automated review on the migration itself caught real, live issues before they shipped:

- A write failure being *reported* through the same logging pipe that had just failed, which could loop indefinitely under a persistent failure (a full disk, a corrupted database) instead of backing off and retrying normally.
- Multiple contexts flushing independently meant insertion order didn't reliably match chronological order, fixed with a proper timestamp index, so "most recent" and "oldest to evict" both mean what they say.
- A multi-entry write done as separate transactions per entry, which could leave a partial batch committed and then duplicated on retry after a failure partway through, now one atomic transaction per flush.
- The "Clear log" button silently reporting success even when the underlying clear had failed.
- The one-off cleanup of the *old* `chrome.storage.local` keys, running from a place that itself ran in every context: for a profile that had already accumulated a multi-megabyte buffer under the old design, that cleanup call was itself a `chrome.storage.local` mutation, and would have broadcast that same oversized payload to every suspended tab one more time, on exactly the code path meant to eliminate it. Moved to run once, from the service worker only.
- Trimming the store back down to its cap, if triggered from the same per-context flush path the old design used, would let dozens of tabs each independently decide "trim needed" at once. Replaced with a single periodic `chrome.alarms` schedule, the same mechanism TMS already uses for backup and news-feed timing.

And a real behaviour change worth naming rather than hiding: TMS declares `"incognito": "split"` in its manifest, so a regular window and an incognito one run fully separate extension instances. `chrome.storage.local` wasn't partitioned by that split (both instances shared one buffer under the old design), but IndexedDB is. A regular debug session can no longer see what happened in an incognito window. Bridging the two isn't practical without reintroducing some form of cross-context broadcast, which is the exact mechanism this whole migration exists to eliminate, so this is accepted as a known limitation rather than worked around.

Then live testing caught one more thing none of the automated review did: after adding that new timestamp index, the log view briefly showed "No entries" while the entry counter kept climbing normally. IndexedDB only re-runs its schema-upgrade step when the requested database version number goes *up*: a profile that had already opened the database at its current version earlier the same day, before the index existed, never got it added. A quick version bump forced the upgrade to actually apply. A good reminder that review catches a great deal, but nothing replaces someone actually reloading the extension and using it.

## A couple of other things fixed along the way

Chasing the same crash surfaced two more issues in adjacent code, both worth a brief mention even though they're not directly about the log buffer:

A queue used for retrying tab-initialization work during startup had a subtle timing gap: a job that legitimately needed several retries (completely normal when many tabs restore at once) could end up running for minutes with the extension's own startup-completion flag stuck `true` the whole time, silently disabling recovery behaviour. It now has a real overall time limit alongside its existing retry-count limit, generous enough not to punish normal retries, but no longer effectively unbounded.

And a favicon-related job that starts initializing a suspended tab could keep running against a tab that had already navigated away, been discarded, or closed mid-initialization, in a few different ways depending on exactly when that happened. Each of those was closed with a shared cancellation signal that the job checks at every step, rather than a growing pile of individual point-checks that could only ever catch the specific timing gap someone happened to find.

## Where this leaves things

None of this changes what TMS does for a normal user with `captureLogs` off, which is the overwhelming majority of installs. What it changes is whether the diagnostic tooling itself, and the extension underneath it, can be trusted to run for an extended period, under real load, without becoming the thing you have to reload the browser to escape from. That was the actual bar for this work, and every fix above, in both rounds, was driven by hitting it, not by a checklist.

If you are running a build with `captureLogs` on to help track down an issue and still see something behaving oddly, please [open an issue on GitHub](https://github.com/gioxx/MarvellousSuspender/issues) with a downloaded debug report attached. That is exactly the workflow that made this whole investigation possible in the first place.

:::info
Both rounds of fixes described above are merged ([#472](https://github.com/gioxx/MarvellousSuspender/pull/472) and [#473](https://github.com/gioxx/MarvellousSuspender/pull/473) on GitHub) and included in **TMS 9.0.3**, submitted for Chrome Web Store review. See the [9.0.3 release post](/blog/tms-release-9-0-3) for the full picture and current status.
:::
