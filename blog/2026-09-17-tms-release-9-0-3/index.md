---
slug: tms-release-9-0-3
title: "The Marvellous Suspender 9.0.3 - battery-aware suspend, tab-group actions, favicon and Drive fixes"
description: "9.0.3 ships a battery-power auto-suspend timeout, tab-group and app-window suspend controls, a real fix for suspended-tab favicons on Brave/Vivaldi/Dia, and a proper Drive backup fix for Brave and Vivaldi. Live now on the Chrome Web Store."
date: 2026-09-17T13:03:00+02:00
authors: [gioxx]
tags: [release, tms]
---

TMS 9.0.3 is [live on the Chrome Web Store](https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa) as of today. Two of the fixes in it were significant enough to get their own deep-dive posts while they were still in progress, so this one pulls everything together in one place, plus the smaller things that didn't get their own writeup.

{/* truncate */}

## What's new

### Separate auto-suspend timeout for battery power
A new "Suspend tabs on battery power after" select, right alongside the existing plugged-in timeout in Settings. Set it once and tabs suspend more aggressively the moment you unplug, without touching your normal AC timeout at all. Defaults to "Same as when plugged in", so nothing changes unless you go set it.

### "Never suspend app windows"
On by default, like the pinned/audio/active-tab protections it sits next to. Keeps tabs open in an app-mode window, an installed PWA, or a site opened via "Create Shortcut → Open as window", out of automatic suspension. A manual "suspend this tab now" still works regardless, this only affects the automatic timer.

### Suspend/unsuspend every tab in a tab group
New page and tab-strip right-click menu items, plus two bindable keyboard shortcuts, acting on every tab sharing the clicked tab's group. Thanks to **[@mherkazandjian](https://github.com/mherkazandjian)** for building this, his first contribution to the project ([#438](https://github.com/gioxx/MarvellousSuspender/pull/438)) and part of a bigger [tab-groups feature set](https://github.com/gioxx/MarvellousSuspender/issues/133) still in progress for upcoming releases.

### "Always reopen suspended tabs scrolled to the top"
Opt-in. If you'd rather a suspended tab always reopen at the top of the page instead of wherever you left it scrolled, this does that, and overrides a `#section` link anchor in the URL too.

### Reload also unsuspends background tabs
Reloading a suspended tab you're not currently looking at, via a multi-tab selection, or right-click → Reload on an inactive tab, used to silently do nothing. Turn this on and it counts as an explicit unsuspend request, same as reloading the tab you're actively viewing already did.

### A "What's new" screen after updates
Exactly what you're reading the substance of right now, just inside the extension: a one-time modal on the Settings page after an update, showing only that version's changes, not the entire history.

## What's fixed

### A rare but real out-of-memory crash
Reproduced live, traced all the way to its actual mechanism, and fixed at the root rather than patched around the symptom: `chrome.storage.onChanged` was quietly broadcasting a full multi-megabyte copy of the diagnostic log buffer to every open suspended tab, every time anything was logged, and none of those copies ever got released. The whole log buffer moved to IndexedDB, which has no such broadcast, closing the gap entirely. Mostly invisible unless you use the debug page's `captureLogs` option, but the extension is more resilient across the board regardless. Full story: [9.0.3 in progress: chasing down a crash in TMS's own debug tooling](/blog/tms903-stability-debug-page).

### Google Drive backup disconnecting on Brave and Vivaldi
9.0.2 stopped the Drive connect flow from hanging on these browsers, but the token it fell back to was still short-lived and unreliable to renew, so accounts kept flipping back to "disconnected" after a backup or two. 9.0.3 replaces it with an authorization-code + PKCE exchange that mints a genuine long-lived refresh token, renewed by a direct call that doesn't depend on the browser at all, with the OAuth client secret moved server-side into a small proxy (`tms-oauth-proxy`) so it no longer ships inside the extension package. **If you're on Brave or Vivaldi with Drive backup enabled, you'll need to reconnect once** (Options → Backup → Connect) after updating, then it stays connected reliably. Full story: [9.0.3 in progress: a real fix for Drive backups disconnecting on Brave and Vivaldi](/blog/tms903-drive-pkce-refresh-token).

### Suspended-tab favicons stuck on the extension icon after a restart
Mostly reported on Brave, Vivaldi, and Dia, where the automatic repair pass depended on a startup event those browsers don't fire reliably, so favicons reverted to TMS's own icon on every restart until manually fixed via Tab Health. A dedicated, restart-independent backstop now retries on its own on every service worker wake, and again the instant you open a suspended tab, so it recovers without you doing anything ([#474](https://github.com/gioxx/MarvellousSuspender/issues/474), [#397](https://github.com/gioxx/MarvellousSuspender/issues/397), [#260](https://github.com/gioxx/MarvellousSuspender/issues/260)). Thanks to everyone who tested pre-release builds and sent back debug reports to help pin this down.

### The battery-specific timeout not reacting to unplugging
It needed a manual trigger to take effect before; now it responds immediately when you unplug.

### A bright white flash switching between suspended tabs
Especially noticeable in dark mode. Reported as far back as v7.1.6.2 ([#168](https://github.com/gioxx/MarvellousSuspender/issues/168)), finally tracked down: a render-blocking stylesheet now paints the background immediately instead of showing the browser default until the real styles load.

### The reload link on suspended tabs, too bright in dark mode
Toned down from accent-blue to a subdued gray that actually fits the rest of that page's quiet dark-mode look.

### Smaller fixes
Tab reload/unsuspend determinism across a multi-tab selection, the debug page's tab-status list getting permanently stuck on "unknown" for a tab whose script had genuinely died, and a spacing inconsistency in Options.

## What's next

The [tab-groups feature set](https://github.com/gioxx/MarvellousSuspender/issues/133) that @mherkazandjian and, more recently, **[@jadshaker](https://github.com/jadshaker)** have been building out continues past this release: a "suspend/unsuspend all tabs not in a group" counterpart and a global "never suspend tabs in a tab group" toggle have already landed on the development branch, with a per-group override still going through review, all targeting the next release. Ukrainian was added as a supported language, with translation now underway thanks to a community volunteer. Beyond that, 9.1.0 is shaping up around wider platform reach (Edge Add-ons Store, Group Policy for managed deployments) and finer control over suspend behaviour and UI.

I wish you all the best on your journey.

*Giovanni*

---

*Full changelog on GitHub: [CHANGELOG.md](https://github.com/gioxx/MarvellousSuspender/blob/master/CHANGELOG.md)*
