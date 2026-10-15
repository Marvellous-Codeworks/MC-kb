---
sidebar_position: 1
title: "FAQ"
description: Frequently Asked Questions about The Great-er Tab Discarder.
hide_title: true
id: faq
tags:
  - FAQ
  - TGD
  - The Great-er Tab Discarder
  - Marvellous Codeworks
---

# Frequently Asked Questions

## General

### Is The Great-_er_ Tab Discarder open source?

**Yes.** The code is [publicly available on GitHub](https://github.com/rkodey/the-great-er-discarder-er) under the GNU General Public License v2.

### Is TGD compatible with Chromium browsers?

The primary distribution channels are the **Chrome Web Store** and **Microsoft Edge Add-ons**. For other Chromium-based browsers (Brave, Vivaldi, etc.), installation and policy support varies, verify case by case.

### Is TGD free? Does it collect my data?

TGD is completely free and contains no analytics or tracking. Everything stays local to your browser profile. See [Permissions](./permissions.md) for a full breakdown.

### What is the difference between Discarding and Suspending a tab?

| | Discard | Suspend |
|---|---|---|
| **How it works** | Uses the browser's native tab discard API to unload the tab from memory | Replaces the tab with a lightweight TGD-hosted page |
| **Memory freed** | More, the browser fully unloads the tab | Less, a simple HTML page stays in memory |
| **Visual appearance** | Tab looks normal but reloads when activated | Tab shows a suspended page (customizable title prefix, favicon) |
| **Best for** | Maximum memory savings | Visual distinction and customization |

You can switch between automatic Discarding and Suspending in **Settings → General**.

### What Chrome version does TGD require?

TGD 1.x requires **Chrome 108 or later**.

---

## Using TGD

### Some tabs are never discarded even though they have been inactive for a long time. Why?

Several settings can prevent a tab from being processed automatically:

- The tab is **pinned** and "Do not Discard pinned tabs" is enabled
- The tab is **playing audio** and "Do not Discard tabs playing audio" is enabled
- The tab is the **active (focused) tab** in its window
- The tab's URL matches an entry in your **whitelist**
- The timer is set to **Never**
- The device is offline and "Only auto-Discard if connected to the internet" is enabled
- The device is on AC power and "Only auto-Discard if running on battery" is enabled

### How do I prevent a specific tab from being discarded?

- **Right-click the tab → Pause discarding this tab**: pauses auto-discard for that tab until the next reload
- **Pin the tab**: pinned tabs are excluded by default (if the option is enabled)
- **Add the URL to the whitelist** in Settings → General → Whitelist

### How do I discard or suspend a tab manually?

From the extension popup, or via keyboard shortcuts:

- `Ctrl+Shift+D`: Discard the active tab
- `Ctrl+Shift+S`: Suspend the active tab

See [Keyboard shortcuts](./keyboard-shortcuts.md) for the full list and instructions on reassigning them.

### Can I migrate my suspended tabs from The Marvellous Suspender or The Great Suspender?

**Yes.** TGD supports migrating suspended tabs from several extensions. Open **Options → Migrate Tabs** for the full list and instructions. See [Migrating tabs from other extensions](./tab-migration.md).

---

## Permissions and privacy

### Why does TGD need the `tabs` permission?

TGD needs to read and manage your open tabs, this is the core permission that makes discarding and suspending possible.

### Why does TGD need the `favicon` permission?

To read the favicon of each tab so it can be displayed on the suspended page, and to apply visual modifications like favicon dimming for suspended tabs.

### Does TGD need access to all my websites?

No. Unlike TMS, TGD does not inject content scripts into web pages and therefore does not require broad host permissions. See [Permissions](./permissions.md) for the full breakdown.

---

## Contributing

### How can I contribute?

Submit pull requests or bug reports on [GitHub](https://github.com/rkodey/the-great-er-discarder-er). For questions or feature ideas, use [GitHub Discussions](https://github.com/rkodey/the-great-er-discarder-er/discussions) before opening a formal issue.
