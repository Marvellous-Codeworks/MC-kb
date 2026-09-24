---
sidebar_position: 5
title: "FAQ"
description: Frequently Asked Questions about The Marvellous Suspender.
hide_title: true
id: faq
tags:
  - FAQ
  - TMS
  - The Marvellous Suspender
  - Marvellous Codeworks
---

# Frequently Asked Questions

*The Marvellous Suspender is referred to as **TMS** throughout this documentation.*

## General

### Is TMS open source?

**Yes.** The code is [publicly available on GitHub](https://github.com/gioxx/MarvellousSuspender) under the GNU General Public License v2.

### Is TMS compatible with Chromium browsers?

The primary distribution channel is the Chrome Web Store. For Chromium-based browsers, installation and policy support varies by browser. We have active users on **Vivaldi**, **Brave**, and **Microsoft Edge**.

### Is TMS free? Does it collect my data?

TMS is completely free, contains no ads, and collects no user data. Everything stays local to your browser profile, with one opt-in exception: if you enable the [Google Drive backup destination](./pages/backup-sync#google-drive), your own session backups are uploaded directly to your own Google Drive, never to a Marvellous Codeworks server. See [Permissions](./permissions) for a full breakdown.

### What happened to The Great Suspender?

The Great Suspender was removed from the Chrome Web Store in February 2021 after ownership changed hands and malicious code was discovered in a later version. TMS was created from a clean fork of the last trusted TGS release (7.1.5) to continue the project under active, open-source maintenance.

---

## Installation and updates

### Where do I install TMS?

From the [Chrome Web Store](https://go.gioxx.org/tgs). If you prefer to load it manually, see [Install from source](./tms-install-from-source).

### What version of Chrome do I need?

TMS requires **Chrome 110 or later** (this has not changed since 8.x). The extension uses Manifest V3, which is not available in older Chrome versions.

### TMS showed a "new version available" banner even though I already updated. What gives?

This was a bug in 8.1.0 and 8.1.1, fixed in [8.1.1](../../blog/tms-release-8-1-1) and fully resolved in [8.1.2](../../blog/tms-release-8-1-2). Update to the latest version from the Chrome Web Store.

---

## Using TMS

### Some tabs are never suspended even though they have been inactive for a long time. Why?

Several settings can prevent a tab from being suspended automatically:

- The tab is **pinned** and "Don't suspend pinned tabs" is enabled
- The tab is **playing audio**
- The tab is the **active (focused) tab** in its window
- The tab contains **unsaved form data**
- The tab's URL matches an entry in your **never-suspend list**
- The "Suspend automatically after" timer is set to **Never**
- The device is connected to power and "Only suspend on battery" is enabled
- The device is offline and "Only suspend when connected" is enabled

### A tab I was working on got suspended unexpectedly. How do I prevent this?

The fastest options:
- **Pin the tab**: pinned tabs are excluded from auto-suspension by default.
- **Right-click the tab → TMS → Pause**: pauses auto-suspension for that tab until the next reload.
- **Add the URL to the never-suspend list** in Settings → Suspend → Never suspend.

### I lost tabs after a browser restart. Can I recover them?

First check [Session Management → Recent sessions](./pages/session-management#recent-sessions), TMS automatically creates a restore point at browser start, so your tabs are very likely already there. If not, see the [guide for recovering lost tabs](./troubleshooting/tgs-recover-lost-tabs) (archived from the original TGS project), the recovery steps still apply.

If you lost tabs that were inside **Chrome Tab Groups** after a Chrome 149 update, see the [dedicated post on this bug](../../blog/tms-tab-groups-chrome-149-bug) and try the one-click repair on the [Tab Health](./pages/tab-health#broken-tab-groups-after-restart) page.

### Can I import sessions from The Great Suspender?

**Yes.** Open the TMS [Session Management](./pages/session-management) page (extension popup → Session Manager icon) and use the **Import** function to load a session file exported from TGS. If you still have suspended TGS tabs open, [Session Management → Migrate](./pages/session-management#migrate-from-another-suspender) can convert them to TMS in place, without needing a file at all.

### Some of my suspended tabs show a generic icon instead of the site's real favicon. How do I fix this?

Open [Tab Health](./pages/tab-health), click **Scan tabs**, and use the offered repair action, TMS detects and fixes this automatically. See [Tab Health → Repair actions](./pages/tab-health#repair-actions) for what each fix does.

### Can TMS back up my tabs automatically, including across multiple computers?

Yes, see [Backup & Sync](./pages/backup-sync). Automatic backups can be saved locally or to Google Drive, and if you use TMS on more than one device with the same Google account, each device's backups rotate independently so a small session from a laptop can't push out a large session's backups from your main machine.

---

## Permissions and privacy

### Why does TMS need access to all websites (`http://*/*`)?

This is required by Chrome's `scripting` API, which TMS uses to detect unsaved form data and read scroll positions before suspending. Without host permissions, these content scripts cannot run. The permission does not give TMS the ability to read or transmit your browsing data, the full explanation is on the [Permissions](./permissions) page.

### Why does TMS need access to my browsing history?

Only to remove suspended-tab URLs (`chrome-extension://…`) from your history when you restore a tab, so those internal pages don't pollute your history. TMS never reads, uploads, or stores your history.

### Why does TMS ask for the `downloads` and `identity` permissions?

Both were added in TMS 9 for the optional [Backup & Sync](./pages/backup-sync) feature: `downloads` lets TMS save local backup files to your Downloads folder, and `identity` lets TMS authenticate with Google Drive if you choose that as your backup destination. Since **9.0.1**, both are requested on demand, Chrome only asks for `downloads` when you actually toggle on automatic backup, and only asks for `identity` when you click **Connect** to link a Google account, instead of being requested upfront at install/update time. If you never use either feature, TMS never requests them. See [Permissions → What changed in 9.x](./permissions#what-changed-in-9x).

### I enabled automatic backup under TMS 9.0.0. Do I need to redo anything after updating to 9.0.1?

No. Chrome preserves permissions you already granted even when a later update moves them from required to optional in the manifest, which is what 9.0.1 does for `downloads` and `identity`. You won't see a new permission prompt and your backup settings keep working exactly as before.

---

## Contributing and localization

### How can I contribute?

Submit pull requests or bug reports on [GitHub](https://github.com/gioxx/MarvellousSuspender). For new features or general questions, use [GitHub Discussions](https://github.com/gioxx/MarvellousSuspender/discussions) to discuss the approach before writing code or opening a formal issue.

### What should I include in a bug report?

For anything related to broken favicons or Tab Groups, run a scan on [Tab Health](./pages/tab-health) and use **Copy report** to paste the results directly into your issue. For anything else, open the [Diagnostic page](./pages/diagnostic-page), enable **captureLogs**, reproduce the problem, then use **Copy report** or **Download report**, this bundles your TMS version, browser details and recent logs into one shareable block. This captureLogs report can include tab titles/URLs, so upload it to [logdrop](https://logdrop.marvellouscode.works) instead of pasting it into the issue, only the maintainer can read it, and it expires on its own.

### How can I translate TMS into my language?

Translations are managed on [Crowdin](https://crowdin.com/project/tms). If your language is not listed, open a [feature request](https://github.com/gioxx/MarvellousSuspender/issues/) to have it added.
