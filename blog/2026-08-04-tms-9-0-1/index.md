---
slug: tms-release-9-0-1
title: "The Marvellous Suspender 9.0.1: on-demand permissions, and closing the gaps from 9.0.0"
description: "9.0.1 delivers on what we promised in the permissions FAQ post: downloads and identity are now requested on demand instead of upfront, the news feed has an opt-out, and the Drive-only local file mystery is explained right on the page."
date: 2026-08-04T13:00:00+01:00
authors: [gioxx]
tags: [tms, release, announcement]
---

We said it was coming in [the last post](/blog/tms9-public-permissions-faq), and it's here. 9.0.1 is a direct response to [issue #411](https://github.com/gioxx/MarvellousSuspender/issues/411) and everything we admitted needed fixing there: permissions requested too early, missing opt-outs, and a couple of things that were working as intended but never explained anywhere.

{/* truncate */}

## Permissions are now on demand, not upfront

This is the headline change. In 9.0.0, `downloads` and `identity` were declared as regular permissions, so Chrome asked for both the moment you updated, whether or not you ever touched the backup feature. That's exactly what triggered the disable-and-reprompt dialog most of you saw, and exactly what [issue #411](https://github.com/gioxx/MarvellousSuspender/issues/411) called out as "substantially overprivileged for users who do not use backups."

Starting with 9.0.1:

- **`downloads`** is only requested the moment you toggle **Enable automatic backup** on, in [Backup & Sync](/docs/TMS/pages/backup-sync). Leave it off, and TMS never asks.
- **`identity`** is only requested when you click **Connect** to link a Google account for Drive backup. Never click it, and TMS never asks.

If you already had backup enabled under 9.0.0, you won't see anything new, Chrome keeps permissions you already granted when a later update moves them from required to optional. No re-prompt, nothing to redo.

Full breakdown on the [permissions page](/docs/TMS/permissions#optional-permissions-requested-on-demand).

## A quieter way to be reminded backup exists

Session backup is still, by a wide margin, the most requested feature TMS has ever shipped, and the vast majority of you haven't turned it on yet. Rather than push harder, 9.0.1 adds a deliberately low-key nudge: a small amber badge on the toolbar icon, a banner in the popup, and a note on the Backup & Sync page, all pointing at the same place, all easy to dismiss.

**Remind me in 10 days** snoozes it. A permanent **I'm not interested, stop reminding me** checkbox on the Backup & Sync page turns it off entirely. No pop-ups, no repeated interruptions, just a quiet signal that stays out of your way once you've told it to.

## News feed opt-out

The daily background check against `marvellouscode.works` for TMS-related posts (feeding the in-extension News page) had no way to turn off. It does now: **Enable news feed** in Settings → General, on by default. Turn it off and the fetch alarm is cleared immediately, along with the **News** entry in the sidebar.

## The Drive-only local file, explained

If your backup destination is Google Drive but you still occasionally see a file appear in your Downloads folder, that's not a bug. On browser shutdown, TMS always writes a local safety-net copy first, a Drive upload isn't reliable in that narrow shutdown window, so the file gets queued and uploaded on the next startup instead, then cleaned up automatically once that upload succeeds. This was true since 9.0.0 but never explained anywhere in the UI, [issue #411](https://github.com/gioxx/MarvellousSuspender/issues/411) was right to flag it. It's now spelled out directly on the Backup & Sync page.

## In-app permissions transparency

Two smaller, related additions: a one-time banner on the Settings and Backup & Sync pages explaining the permissions change above (with a link to the docs), and a persistent reference note on the Backup & Sync page for anyone who lands there later and wants the short version without digging through a blog archive. Going forward, this is where permission changes get explained, not just here.

## What we're not doing

Backup content encryption came up as a suggestion in issue #411 too. We're not adding it, not in 9.0.1 and not planning to. Backup files carry the same level of protection the manual "Export session" feature has had since 2017 (plain JSON, no encryption), nothing on your machine or your own Drive `appdata` folder is exposed to anyone else by that choice, and we'd rather keep the feature simple than bolt on a passphrase system nobody asked for twice.

## Thanks

To everyone who pushed back on 9.0.0's permission model instead of just uninstalling and moving on: this release exists because you took the time to write it up instead. That's the whole reason [issue #411](https://github.com/gioxx/MarvellousSuspender/issues/411) got a direct answer instead of a shrug, and it's why the fix landed this fast.

If something's still off, [open an issue](https://github.com/gioxx/MarvellousSuspender/issues) or use the [report form](https://marvellouscode.works/tms/report). We read all of it.

---

*Full changelog on GitHub: [v9.0.1 release](https://github.com/gioxx/MarvellousSuspender/releases/tag/v9.0.1)*
