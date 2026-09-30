---
sidebar_position: 0
title: "Overview"
description: What The Marvellous Suspender is, how tab suspension works, what it keeps safe, and where to go next.
tags:
  - TMS
  - The Marvellous Suspender
---

# Overview

**The Marvellous Suspender** (TMS) is a free, open-source Chrome extension that frees memory by **suspending** tabs you aren't using. It's the maintained, clean continuation of *The Great Suspender*: TMS was forked from the last trusted TGS release (7.1.5) after the original was sold and removed from the Chrome Web Store for shipping malicious code in 2021.

:::info[Get TMS]
Install it from the **[Chrome Web Store](https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa)**. Requires Chrome **110** or later (Manifest V3). It also works on Chromium browsers such as Edge, Brave and Vivaldi; to load it manually, see [Install from source](./tms-install-from-source).
:::

---

## How it works

1. **A tab goes idle.** TMS tracks how long each tab has been inactive.
2. **It gets suspended.** After the timeout you choose (from 20 seconds to 2 weeks, or never), TMS replaces the tab with a lightweight *suspended page* that shows the tab's title, favicon and, optionally, a screenshot of the page. The original page is unloaded, freeing its memory and CPU.
3. **You bring it back when you need it.** Click the suspended page (or focus the tab, if you enable it) and the original page reloads, scrolled back to where you left it.

Tabs that are still in use are left alone: the active tab, pinned tabs, tabs playing audio, tabs with unsaved form data and sites on your never-suspend list are skipped, all configurable in [Settings](./pages/settings#suspend). You can also suspend, unsuspend or pause tabs by hand from the [toolbar popup](./pages/quick-actions-popup), the right-click menu or [keyboard shortcuts](./pages/keyboard-shortcuts).

---

## What it does

| Area | What you get | Read more |
|---|---|---|
| Suspension rules | Timeout, separate battery timeout, pinned/audio/form/active-tab exceptions, never-suspend and always-suspend lists, online/battery-only modes | [Settings](./pages/settings) |
| Suspended page | Title, favicon, optional screenshot (visible area or full page), original URL in the title, YouTube position kept | [Settings → Suspended Tabs](./pages/settings#suspended-tabs) |
| Sessions | Current session, automatic restore points at every browser start, saved sessions, import/export | [Session management](./pages/session-management) |
| Migration | Convert suspended tabs from The Great Suspender and other suspenders in place | [Session management → Migrate](./pages/session-management#migrate-from-another-suspender) |
| Backup & Sync | Automatic backups, locally or to your own Google Drive, rotated per device | [Backup & Sync](./pages/backup-sync) |
| Repairs | Scan for broken favicons and Tab Groups issues, one-click fixes | [Tab Health](./pages/tab-health) |
| Diagnostics | Log capture and debug toggles for bug reports | [Diagnostic page](./pages/diagnostic-page) |
| Personalization | Light/dark suspended page, more than 15 languages via Crowdin, optional classic TGS artwork, in-extension news feed | [Settings → General](./pages/settings#general) |

---

## Privacy at a glance

TMS is free, has no ads and collects no data: settings, sessions and screenshots stay in your browser profile. The one opt-in exception is Google Drive backup, which uploads your own backups to **your** Google Drive, never to a Marvellous Codeworks server. The [news feed](./pages/news-feed) only downloads public posts from `marvellouscode.works` and can be turned off. Broad permissions such as access to all sites exist only so TMS can check for unsaved forms and remember scroll positions before suspending; [Permissions](./permissions) explains each one.

---

## TMS or TGD?

Marvellous Codeworks also maintains **[The Great-er Tab Discarder](../TGD/overview)** (TGD). The two share the same goal and free a similar amount of memory; TGD can be thought of as a lighter take on the same idea, while TMS adds session, backup and repair tools on top.

Both can suspend *and* discard tabs, they just start from a different default:

| | TMS | TGD |
|---|---|---|
| By default | **Suspends**: replaces idle tabs with its own suspended page (title, favicon, optional screenshot) | **Discards**: uses the browser's native discard, the tab looks unchanged and reloads when you click it |
| Also available | **Discard after suspending**: the suspended page itself is discarded too | **Suspend mode**: replaces idle tabs with its own suspended page (title prefix, dimmed favicon) |
| Features | Suspension rules and lists, screenshots, session manager with restore points, backups and Google Drive sync, Tab Health repairs, diagnostics | Discard/suspend rules and whitelist, startup protection, tab migration, settings sync, profiler |

---

## Where to go next

- New to TMS: start with the [Settings reference](./pages/settings) and the [toolbar popup](./pages/quick-actions-popup).
- Coming from The Great Suspender: see the [FAQ](./faq) and [Session management → Migrate](./pages/session-management#migrate-from-another-suspender).
- Something wrong: check [Troubleshooting](./troubleshooting/extension-repair-recovery) and [Tab Health](./pages/tab-health), and report bugs on [GitHub](https://github.com/gioxx/MarvellousSuspender/issues) with a [diagnostic report](./pages/diagnostic-page).
- Want to help: [Contributing](./tms-contributing).

TMS is released under the [GNU GPL v2](https://github.com/gioxx/MarvellousSuspender/blob/master/LICENSE). Release notes are published on the [blog](/blog).
