---
sidebar_position: 0
title: "Overview"
description: What The Great-er Tab Discarder is, how discarding works, how it differs from suspending, and where to go next.
tags:
  - TGD
  - The Great-er Tab Discarder
---

# Overview

**The Great-_er_ Tab Discarder** (TGD) is a free, open-source extension for Chrome and Edge that helps your browser run faster by freeing the memory and resources used by inactive tabs. It's the maintained Manifest V3 continuation of *The Great Discarder*. No tracking, no drama, only fast-_er_ browsing.

:::info[Get TGD]
Install it from the **[Chrome Web Store](https://chromewebstore.google.com/detail/the-great-er-tab-discarder/plpkmjcnhhnpkblimgenmdhghfgghdpp)** or **[Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/the-greater-tab-discarder/lieejiddoadedggjdkgeellgeeibbnai)**. Requires Chrome **108** or later. On other Chromium browsers (Brave, Vivaldi...) support varies.
:::

---

## How it works

1. **A tab goes idle.** TGD tracks how long each tab has been inactive.
2. **It gets discarded.** After the timeout you choose (up to 3 days, or never), TGD asks the browser to **discard** the tab using its native discard API: the page is unloaded from memory, but the tab stays in the tab strip looking exactly the same.
3. **You bring it back by clicking it.** The browser reloads the page as soon as you switch to the tab.

Because TGD relies on the browser's own mechanism, it adds practically no overhead and never needs to read or inject anything into the pages you visit.

If you'd rather *see* which tabs are unloaded, switch the automatic mode to **Suspend**: TGD then replaces idle tabs with a lightweight suspended page, with an optional title prefix and dimmed favicon. See [Discard vs Suspend](./faq#what-is-the-difference-between-discarding-and-suspending-a-tab).

Tabs that are still in use are left alone: the active tab, and optionally pinned tabs, tabs playing audio and sites on your whitelist. You can also discard or suspend tabs by hand from the popup, the right-click menu or [keyboard shortcuts](./keyboard-shortcuts), including every tab in a window at once.

---

## What it does

| Area | What you get | Read more |
|---|---|---|
| Automatic mode | Discard (default) or Suspend, inactivity timeout from never to 3 days | [Settings → General](./settings#general-settings) |
| Exceptions | Pinned tabs, tabs playing audio, whitelist with plain text or regular expressions, online-only and battery-only modes | [Settings](./settings) |
| Browser startup | *Prevent reloading all tabs*: keep every tab unloaded after a restart instead of reloading them all at once | [Settings → Browser Startup](./settings#browser-startup) |
| Manual actions | Popup, right-click menu, shortcuts to discard/suspend the current tab, or discard/reload whole windows | [Keyboard shortcuts](./keyboard-shortcuts) |
| Migration | Bring over suspended tabs from TMS, The Great Suspender, Tab Suspender and Tiny Suspender | [Migrating tabs](./tab-migration) |
| Sync | Settings synced through your Google account (Chrome sync) | [Settings → Other](./settings#other) |

---

## Privacy at a glance

TGD contains no analytics or tracking and doesn't inject scripts into web pages, so it doesn't need access to your websites. Settings and the whitelist are stored in your browser profile; the optional settings sync uses Chrome's own sync, nothing passes through a Marvellous Codeworks server. See [Permissions](./permissions) for each permission and why it's needed.

---

## TGD or TMS?

Marvellous Codeworks also maintains **[The Marvellous Suspender](../TMS/overview)** (TMS). The two share the same goal and free a similar amount of memory; TGD can be thought of as a lighter take on the same idea, while TMS adds session, backup and repair tools on top.

Both can discard *and* suspend tabs, they just start from a different default:

| | TGD | TMS |
|---|---|---|
| By default | **Discards**: uses the browser's native discard, the tab looks unchanged and reloads when you click it | **Suspends**: replaces idle tabs with its own suspended page (title, favicon, optional screenshot) |
| Also available | **Suspend mode**: replaces idle tabs with its own suspended page (title prefix, dimmed favicon) | **Discard after suspending**: the suspended page itself is discarded too |
| Features | Discard/suspend rules and whitelist, startup protection, tab migration, settings sync, profiler | Suspension rules and lists, screenshots, session manager with restore points, backups and Google Drive sync, Tab Health repairs, diagnostics |

---

## Where to go next

- New to TGD: read the [Settings reference](./settings) and set your timeout and whitelist.
- Coming from another suspender whose tabs you don't want to lose: [Migrating tabs from other extensions](./tab-migration).
- Questions: the [FAQ](./faq); ideas and help: [GitHub Discussions](https://github.com/rkodey/the-great-er-discarder-er/discussions).
- Bugs and contributions: [GitHub](https://github.com/rkodey/the-great-er-discarder-er).

TGD is released under the [GNU GPL v2](https://github.com/rkodey/the-great-er-discarder-er/blob/main/LICENSE).
