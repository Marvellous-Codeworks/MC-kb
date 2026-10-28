---
sidebar_position: 1
title: "Permissions"
description: What permissions The Marvellous Suspender requests and why each one is needed.
tags:
  - TMS
  - The Marvellous Suspender
  - permissions
  - privacy
---

# Permissions

TMS requests only the permissions it genuinely needs to function. This page explains what each permission does and why it is required.

---

## Current permissions

### Required permissions

These are declared as regular permissions and are granted automatically when TMS is installed or updated.

#### Tabs

Grants access to the list of open tabs and their properties (URL, title, active state, pinned state, group membership). This is the core permission that makes suspension possible. Without it, TMS cannot read or manipulate tabs.

#### Active tab

`activeTab` gives TMS temporary access to the tab you are looking at, only at the moment you invoke the extension on it: from the popup, a keyboard shortcut or the right-click menu. TMS uses it to take a real browser screenshot of that tab for its [suspended-page preview](./pages/settings.md#capture-method). It adds no warning at install time.

#### Storage and unlimited storage

`storage` + `unlimitedStorage` are used to persist your settings, the never-suspend list, favicon cache, and session data. `unlimitedStorage` removes the default 5 MB cap so that large sessions with many tabs can be saved reliably.

#### History

When a tab is unsuspended, TMS removes the suspended-page URL from the browser history so you don't see `chrome-extension://…` entries in your history after restoring tabs.

#### Context menus

`contextMenus` adds TMS commands to the right-click context menu on tabs (suspend, unsuspend, pause, never-suspend list). This permission is optional to use, you can disable the context menu entries in **Settings → General**.

#### Alarms

Manifest V3 extensions cannot use `setTimeout` reliably across service worker restarts. `alarms` provides the scheduling mechanism that TMS uses to check for tabs that have exceeded their configured inactivity timeout, to run the [automatic backup schedule](./pages/backup-sync.md), and to periodically refresh the [News](./pages/news-feed.md) feed.

#### Favicon

Reads the favicon of the page being suspended so it can be displayed on the suspended tab page. This replaces the older (deprecated) `chrome://favicon/*` host permission.

#### Scripting

Allows TMS to run scripts in the context of web pages. Used to:
- Detect unsaved form data before suspending
- Read and store the page's scroll position so it can be restored when you unsuspend

#### Tab groups

`tabGroups` grants access to Chrome's Tab Groups API. Used to save and restore tab group assignments (name, color, collapsed state) when exporting/importing sessions, restoring backups, or upgrading the extension, and to recognise the groups you protect with [Never suspend this group](./pages/settings.md#never-suspend-tabs-in-the-following-tab-groups).

#### Offscreen

`navigator.getBattery()` isn't available inside a Manifest V3 service worker, which has no `window`/DOM. `offscreen` lets TMS create a hidden, DOM-capable offscreen document purely to read the device's charging state, which it reports back to the service worker for the "never suspend while charging" and battery-specific-timeout options. The document renders nothing, is created only once per browser session (self-healing if it ever goes missing), and is never used for anything else.

#### Host permissions

`http://*/*` and `https://*/*` are required by the `scripting` permission, Chrome enforces that host permissions must be declared for any page where content scripts will run.

### Optional permissions (requested on demand) {#what-changed-in-9x}

These are declared as optional (`optional_permissions` or `optional_host_permissions`) and are **not** requested at install or update time. Chrome only prompts for them the moment you actually turn on the related feature, and if you never use that feature, TMS never asks for them.

#### Downloads

Used by the [Backup & Sync](./pages/backup-sync.md) feature to save session backup files (`tms-session-*.json`) to a `tms-backups/` subfolder inside your Downloads folder when the backup destination is set to **Local**, and to track/rotate those files so old backups are cleaned up automatically. TMS never reads the contents of your Downloads folder beyond the files it wrote itself. Chrome only asks you to grant this the moment you toggle **Automatically back up your session** on, not at install or update time. If you never enable local backup, TMS never requests it.

#### Identity

Used exclusively by the optional [Google Drive backup destination](./pages/backup-sync.md#google-drive). It lets TMS obtain an OAuth token via `chrome.identity.getAuthToken()` to authenticate with your Google account. TMS never sees your Google password, the token exchange is handled entirely by Chrome. Chrome only asks you to grant this when you click **Connect** to link a Google account, not at install or update time.

#### File URLs access

Declared as an optional host permission (`file:///*`), needed only if you want TMS to suspend tabs opened from `file://` URLs. It takes two steps, and neither happens at install or update time:

1. Chrome's **Allow access to file URLs** toggle on TMS's entry in `chrome://extensions`, which only you can turn on.
2. The `file:///*` permission itself, which TMS asks for when you click **Open extension settings** on its [local file permissions page](./pages/system-pages.md#local-file-permissions-page). The browser only grants it once the toggle is on.

#### All sites access for recent screenshots

Declared as an optional host permission (`<all_urls>`). Requested only when you turn on [Keep a recent screenshot of tabs as I use them](./pages/settings.md#keep-a-recent-screenshot-of-tabs-as-i-use-them): the browser lets an extension screenshot a tab you haven't invoked it on only if it has access to all sites. TMS uses it for nothing but those screenshots, which stay in your browser profile. Turning the option off gives the permission back.

#### Google API OAuth scope: drive.appdata

Declared in `manifest.json` under `oauth2.scopes`, this is not a Chrome permission but a Google API scope requested when you connect Google Drive. It grants access **only** to a hidden, app-specific folder (`appDataFolder`) that is invisible in the regular Google Drive UI and inaccessible to any other app. TMS cannot see, list, or touch any other file in your Drive. Because `drive.appdata` is a narrow, non-sensitive scope, connecting it does not require Google's OAuth verification process, any Google account can use it without restriction.

---

## Privacy

TMS does not collect, transmit, or sell any user data. All storage (settings, session data, favicon cache) is local to your browser profile. The optional Settings Sync feature uses Chrome's built-in sync mechanism and is subject to Google's privacy policy, nothing passes through Marvellous Codeworks servers.

The optional [Google Drive backup destination](./pages/backup-sync.md#google-drive) uploads your session backups directly from your browser to the hidden `appDataFolder` in your own Google Drive, using the narrow `drive.appdata` OAuth scope. Backup files never pass through any Marvellous Codeworks server, the only two parties involved are your browser and Google's Drive API. You can revoke access at any time from the **Backup & Sync** page or from your [Google Account permissions](https://myaccount.google.com/permissions).

The source code is [publicly available on GitHub](https://github.com/gioxx/MarvellousSuspender) for independent review.
