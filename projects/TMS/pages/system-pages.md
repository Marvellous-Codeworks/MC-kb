---
sidebar_position: 10
title: "System & recovery pages"
description: Reference for the transient screens TMS shows around updates, restarts and permission prompts, what each one means and what to do.
tags:
  - TMS
  - The Marvellous Suspender
  - recovery
  - update
---

# System & recovery pages

Besides the extension's main pages (Settings, Session Management, Backup & Sync, Tab Health, News, About), TMS opens a handful of small, single-purpose pages automatically at specific moments, after an update, after a crash, or when a permission is missing. This page explains what each one is and what to do when you see it.

---

## The suspended tab page

The page shown in place of every tab TMS suspends (`suspended.html`). It shows the site's favicon and title, the original URL, and a hint on how to reload it (click anywhere, or use the tab-toggle [keyboard shortcut](./keyboard-shortcuts.md)). Its appearance (light/dark, screenshot preview) is controlled from [Settings → Suspended Tabs](./settings.md#suspended-tabs).

![A suspended tab, showing the site's favicon, title and original URL](./img/system-pages/01-suspended-page.webp)

*Dark theme:*

![A suspended tab in dark theme](./img/system-pages/01-suspended-page-dark.webp)

If you see **"This site cannot be reached"** on what should be a suspended tab, see [My suspended tab says "This site cannot be reached"](../troubleshooting/tgs-recover-lost-tabs.md#my-suspended-tab-says-this-site-cannot-be-reached).

## Update screens

When TMS updates itself:

- **Pre-update backup prompt** (`update.html`), shown *before* the update is applied, if TMS believes tabs might be at risk. It offers **Export backup** (saves the current session as a `.json` file, same as [Session Management → Export](./session-management.md#export)) and confirms that a recovery restore point was also created automatically, viewable afterwards from [Session Management → Recent sessions](./session-management.md#recent-sessions).
- **Update in progress / completed** (`updated.html`), shown *after* the update finishes. While tabs are being restored it shows a progress state; once done, it confirms success and links to Session Management for anything that needs manual attention. For major version updates it may show extra release-specific notes.

You do not need to act on either screen unless something looks wrong, both are informational.

## Recovery screen

`recovery.html` appears if TMS detects that not all previously-open tabs came back after a browser restart or crash. It lists the tabs it believes are missing and offers:

- **Restore tabs automatically**: reopens the listed tabs for you
- **Manage manually**: jumps to [Session Management](./session-management.md) so you can pick specific windows/tabs yourself instead

![Recovery screen listing the tabs to restore, with "Restore tabs automatically" and "Go to Session Manager" buttons](./img/system-pages/02-recovery-screen.webp)

Once restoration finishes, a success screen confirms all tabs were restored:

![Recovery success screen: "Marvellous success! All your tabs have been restored."](./img/system-pages/02b-recovery-success.webp)

If [screen capture](./settings.md#screen-capturing) is enabled, a notice on this screen offers a quick link to disable it, screenshots are the most expensive part of a suspend/restore cycle on very large sessions, so switching it off here can speed up recovery on future restarts.

## Restoring-window screen

`restoring-window.html` is a brief, no-interaction placeholder shown for a moment while TMS restores an entire window from a saved or recovered session (see [Session Management → Reload/Resuspend](./session-management.md#current-session)). It replaces itself automatically once the real tabs finish loading.

## "Broken" page

`broken.html` appears if TMS's Service Worker cannot start correctly for a given tab (e.g. right after a manual reload of the unpacked extension during development, or a rare corrupted-state case). It offers a **Restart extension** button and a link to Session Management in case tabs need manual recovery, plus a shortcut to file a [GitHub issue](https://github.com/gioxx/MarvellousSuspender/issues) if it keeps happening.

## Local file permissions page

`permissions.html` is what opens when TMS needs access to a local `file://` page but doesn't have it, reached via the popup's **Enable** link (see [Toolbar popup → Local file permissions](./quick-actions-popup.md#local-file-permissions)). It offers:
- **Save backup**: a safety-net export of your current session before you change extension permissions
- **Open extension settings**: asks the browser for access to local files. This only works once **Allow access to file URLs** is on for TMS, which the browser doesn't let an extension switch on by itself: if it is off, the button opens TMS's entry in `chrome://extensions` so you can turn it on. When you come back, the page tells you to click the button again to finish granting access.
