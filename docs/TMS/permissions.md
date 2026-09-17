---
sidebar_position: 3
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

:::info[Current version]
The permission list below reflects TMS **9.0.1+** (Manifest V3). See [What changed in 9.x](#what-changed-in-9x) for the on-demand permission model introduced in 9.0.1, and [Legacy permissions (pre-8.0.0)](#legacy-permissions-pre-800) for what changed compared to 7.x.
:::

---

## Current permissions (v9.x)

### Required permissions

These are declared as regular permissions and are granted automatically when TMS is installed or updated.

#### Tabs

Grants access to the list of open tabs and their properties (URL, title, active state, pinned state, group membership). This is the core permission that makes suspension possible. Without it, TMS cannot read or manipulate tabs.

#### Storage and unlimited storage

`storage` + `unlimitedStorage` are used to persist your settings, the never-suspend list, favicon cache, and session data. `unlimitedStorage` removes the default 5 MB cap so that large sessions with many tabs can be saved reliably.

#### History

When a tab is unsuspended, TMS removes the suspended-page URL from the browser history so you don't see `chrome-extension://…` entries in your history after restoring tabs.

#### Context menus

`contextMenus` adds TMS commands to the right-click context menu on tabs (suspend, unsuspend, pause, never-suspend list). This permission is optional to use, you can disable the context menu entries in **Settings → General**.

#### Alarms

Manifest V3 extensions cannot use `setTimeout` reliably across service worker restarts. `alarms` provides the scheduling mechanism that TMS uses to check for tabs that have exceeded their configured inactivity timeout, to run the [automatic backup schedule](./pages/backup-sync), and to periodically refresh the [News](./pages/news-feed) feed.

#### Favicon

Reads the favicon of the page being suspended so it can be displayed on the suspended tab page. This replaces the older (deprecated) `chrome://favicon/*` host permission.

#### Scripting

Allows TMS to run scripts in the context of web pages. Used to:
- Detect unsaved form data before suspending
- Read and store the page's scroll position so it can be restored when you unsuspend

#### Tab groups

`tabGroups` grants access to Chrome's Tab Groups API. Used to save and restore tab group assignments (name, color, collapsed state) when exporting/importing sessions, restoring backups, or upgrading the extension.

#### Offscreen

`navigator.getBattery()` isn't available inside a Manifest V3 service worker, which has no `window`/DOM. `offscreen` lets TMS create a hidden, DOM-capable offscreen document purely to read the device's charging state, which it reports back to the service worker for the "never suspend while charging" and battery-specific-timeout options. The document renders nothing, is created only once per browser session (self-healing if it ever goes missing), and is never used for anything else.

#### Host permissions

`http://*/*` and `https://*/*` are required by the `scripting` permission, Chrome enforces that host permissions must be declared for any page where content scripts will run.

### Optional permissions (requested on demand)

These are declared as `optional_permissions` and are **not** requested at install or update time. Chrome only prompts for them the moment you actually turn on the related feature.

#### Downloads

Used by the [Backup & Sync](./pages/backup-sync) feature to save session backup files (`tms-session-*.json`) to a `tms-backups/` subfolder inside your Downloads folder when the backup destination is set to **Local**, and to track/rotate those files so old backups are cleaned up automatically. TMS never reads the contents of your Downloads folder beyond the files it wrote itself. Chrome only asks you to grant this the moment you toggle **Enable automatic backup** on, not at install or update time. If you never enable local backup, TMS never requests it.

#### Identity

Used exclusively by the optional [Google Drive backup destination](./pages/backup-sync#google-drive). It lets TMS obtain an OAuth token via `chrome.identity.getAuthToken()` to authenticate with your Google account. TMS never sees your Google password, the token exchange is handled entirely by Chrome. Chrome only asks you to grant this when you click **Connect** to link a Google account, not at install or update time.

#### File URLs access

*Added in 9.0.2.* Declared as an optional host permission (`file:///*`) so Chrome's **"Allow access to file URLs"** toggle appears on TMS's entry in `chrome://extensions` (it was previously missing entirely, since the manifest never declared this access). No access to local files is granted until you flip that toggle yourself, TMS never requests it automatically. Needed only if you want TMS to suspend/manage tabs opened from `file://` URLs.

#### Google API OAuth scope: drive.appdata

Declared in `manifest.json` under `oauth2.scopes`, this is not a Chrome permission but a Google API scope requested when you connect Google Drive. It grants access **only** to a hidden, app-specific folder (`appDataFolder`) that is invisible in the regular Google Drive UI and inaccessible to any other app. TMS cannot see, list, or touch any other file in your Drive. Because `drive.appdata` is a narrow, non-sensitive scope, connecting it does not require Google's OAuth verification process, any Google account can use it without restriction.

---

## What changed in 9.x

TMS 9 introduces optional multi-device session backup (see [Backup & Sync](./pages/backup-sync) for full details), the main source of new permissions over 8.x. 9.0.3 separately adds one more, required permission for the battery-aware auto-suspend timeout:

| Permission / scope | Added for |
|---|---|
| `downloads` | Writing and rotating local backup files in `tms-backups/` |
| `identity` | Authenticating with Google Drive (OAuth token only, no password access) |
| `drive.appdata` (OAuth scope) | Storing backup files in a private, hidden Drive folder |
| `offscreen` (9.0.3) | Reading charging state for the [battery-specific auto-suspend timeout](./pages/settings#suspend-tabs-on-battery-power-after) and "never suspend while charging" |

:::info[Since 9.0.1: on-demand instead of upfront]
In 9.0.0, `downloads` and `identity` were declared as regular (required) permissions, so Chrome asked for both at install/update time even if you never used backup, triggering the "extension disabled, needs new permissions" prompt for everyone. Starting with **9.0.1**, both are declared as `optional_permissions` instead: Chrome only prompts for `downloads` the moment you toggle **Enable automatic backup** on, and only prompts for `identity` when you click **Connect** to link a Google account. If you never turn either feature on, TMS never requests them, and nothing shows up in your permissions list for them at all.

If you already had backup enabled under 9.0.0 (and had therefore already granted these), updating to 9.0.1 does not revoke them or prompt you again, Chrome carries over permissions you already granted when a manifest moves them from required to optional.

9.0.1 also adds a one-time in-app notice (shown on the Settings and Backup & Sync pages) explaining this change with a link back to this page, a persistent reminder on the Backup & Sync page pointing here as well, and an opt-out for the daily [News feed](./pages/news-feed#disabling-the-news-feed) background request, previously always-on with no toggle.
:::

---

## Legacy permissions (pre-8.0.0)

TMS 7.x (Manifest V2) used a different permission model:

| Permission | Status in v8 | Notes |
|---|---|---|
| `tabs` | ✅ Kept | Same purpose |
| `storage` / `unlimitedStorage` | ✅ Kept | Same purpose |
| `history` | ✅ Kept | Same purpose |
| `contextMenus` | ✅ Kept | Same purpose |
| `cookies` | ❌ Removed | Was used to migrate scroll position from even older TGS versions. No longer needed |
| `content_scripts` | ❌ Removed | Replaced by the `scripting` API |
| `alarms` | 🆕 Added | Required for MV3 service worker scheduling |
| `favicon` | 🆕 Added | Replaces deprecated `chrome://favicon/*` |
| `scripting` | 🆕 Added | Replaces content scripts |
| `tabGroups` | 🆕 Added | New feature: Tab Group support |
| `downloads` | 🆕 Added in 9.x | Local session backups. Required permission in 9.0.0, moved to optional/on-demand in 9.0.1 |
| `identity` | 🆕 Added in 9.x | Google Drive authentication (backup destination). Required permission in 9.0.0, moved to optional/on-demand in 9.0.1 |

---

## Privacy

TMS does not collect, transmit, or sell any user data. All storage (settings, session data, favicon cache) is local to your browser profile. The optional Settings Sync feature uses Chrome's built-in sync mechanism and is subject to Google's privacy policy, nothing passes through Marvellous Codeworks servers.

The optional [Google Drive backup destination](./pages/backup-sync#google-drive) uploads your session backups directly from your browser to the hidden `appDataFolder` in your own Google Drive, using the narrow `drive.appdata` OAuth scope. Backup files never pass through any Marvellous Codeworks server, the only two parties involved are your browser and Google's Drive API. You can revoke access at any time from the **Backup & Sync** page or from your [Google Account permissions](https://myaccount.google.com/permissions).

The source code is [publicly available on GitHub](https://github.com/gioxx/MarvellousSuspender) for independent review.
