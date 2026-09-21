---
sidebar_position: 4
title: Recovering lost tabs (TGS archive)
sidebar_label: Recover lost tabs (TGS)
description: Archived guide from the original The Great Suspender project on recovering tabs lost after an extension update or removal.
---

:::note[Archived content]
This page preserves the content of [deanoemcke/thegreatsuspender#526](https://github.com/deanoemcke/thegreatsuspender/issues/526), the official recovery guide from the original The Great Suspender project. The recovery steps described here still apply to The Marvellous Suspender.
:::

:::tip[Different scenario?]
If the browser flagged TMS itself as "corrupted" and offered to repair it, and your sessions/settings vanished afterwards even though the extension is still installed, see [Chrome/Edge extension corruption & repair](./extension-repair-recovery) instead, that's a different failure mode from the one covered on this page.
:::

## Overview

- [Why do my tabs disappear when the extension updates or is removed?](#why-do-my-tabs-disappear-when-the-extension-updates-or-is-removed)
- [What is the safe way to remove the extension?](#what-is-the-safe-way-to-remove-the-extension)
- [What is the safe way to update the extension?](#what-is-the-safe-way-to-update-the-extension)
- [What should I do if I have lost tabs?](#what-should-i-do-if-i-have-lost-tabs)
- [How to recover lost tabs with The Great Suspender](#how-to-recover-lost-tabs-with-the-great-suspender)
- [How to recover lost tabs without The Great Suspender](#how-to-recover-lost-tabs-without-the-great-suspender)
- [My suspended tab says "This site cannot be reached"](#my-suspended-tab-says-this-site-cannot-be-reached)

---

### Why do my tabs disappear when the extension updates or is removed?

The Great Suspender works by redirecting a tab to a new URL in order to "suspend" it. This means that the tab is now controlled by the extension process. When the extension updates or is disabled or uninstalled, this process is killed and all tabs that belong to it are removed from the browser.

The extension *does* come with an inbuilt tab recovery system that will automatically detect and reload lost tabs in the aftermath of an update or extension crash. And in the event of an update, a session restore point is automatically created in the Session History page and can be restored manually.

---

### What is the safe way to remove the extension?

If you want to uninstall the extension, please *unsuspend all tabs* before doing so. This is the only way to prevent those tabs from disappearing. This can be done easily by clicking the **Unsuspend all tabs** option in the extension popup menu, or more manually by visiting every suspended tab and manually reloading it.

Please note that if using the "Unsuspend all tabs" option, you will need to do this once for *each Chrome window* you have open.

If you failed to unsuspend all tabs before uninstalling and have lost tabs, please refer to the section below: [How to recover lost tabs without The Great Suspender](#how-to-recover-lost-tabs-without-the-great-suspender).

Please note, uninstalling the extension will also permanently remove all extension data including tab history and extension options. Reinstalling the extension will not enable you to do any sort of recovery.

It is recommended that anyone wanting to remove the extension first backs up their tabs using another extension called [Session Buddy](https://chrome.google.com/webstore/detail/session-buddy/edacconmaakjimmfgnblocblbcdcpbko?hl=en). This tool allows you to back up all your tabs and restore them again at a later date. Please be aware that tabs suspended at the time the Session Buddy backup is performed will not have their correct URLs, these links will only work as long as The Great Suspender (or The Marvellous Suspender) is currently installed. If you want the real URLs in your backup, you need to unsuspend all your tabs first.

---

### What is the safe way to update the extension?

Unfortunately Chrome does not give the user the ability to manage their own extension updates. As soon as a new release is made available on the webstore, this update is automatically pushed to users.

The extension mitigates this by prompting users to export a backup of their tabs before accepting the new update.

As mentioned above, a session restore point will also automatically be created to save a record of your open tabs before the update. You can then recover any lost tabs via this restore point from the **Session History** screen accessible from the extension Options page.

---

### What should I do if I have lost tabs?

- If you lost tabs due to the extension being **removed**: refer to [How to recover lost tabs without The Great Suspender](#how-to-recover-lost-tabs-without-the-great-suspender).
- If you lost tabs due to the extension being **disabled**: first re-enable the extension, then refer to [How to recover lost tabs with The Great Suspender](#how-to-recover-lost-tabs-with-the-great-suspender).
- If you lost tabs but the extension **still seems to be installed and running**: refer to [How to recover lost tabs with The Great Suspender](#how-to-recover-lost-tabs-with-the-great-suspender).

Before continuing, check that you have not simply switched Chrome profiles. If you have multiple Chrome profiles, each one will have a separate record of tab history.

---

### How to recover lost tabs with The Great Suspender

The extension comes with its own tab history management UI. Go to the extension options page (from **Settings** in the popup, or **Options** when right-clicking the extension icon). Then in the settings sidebar click on **Session management**. This will show your most recent tab sessions, click on each session to see the individual windows and tabs it contains.

To reload a session, click the **reload** link. This will reload all windows and tabs in an unsuspended state. If your session contains a very large number of tabs, you might instead want to click **resuspend**, which will be much faster as it reloads the tabs in a suspended state.

If the missing tabs are not in your recent sessions, follow the guide below for recovering lost tabs without using The Great Suspender.

If you have access to system backups, you may be able to restore old "recent sessions" from those backups. The recent sessions are stored in an IndexedDB database at:

```
Chrome/Default/IndexedDB/chrome-extension_klbibkeccnjlkjkiokjodocebajanakg_0.indexeddb.blob/
Chrome/Default/IndexedDB/chrome-extension_klbibkeccnjlkjkiokjodocebajanakg_0.indexeddb.leveldb/
```

---

### How to recover lost tabs without The Great Suspender

Navigate to `chrome://history` in a new tab. You will see a list of tabs you have visited in the past, grouped by date with the most recent at the top. Somewhere in this list you will have a record of all the tabs you lost, they can be a bit tricky to find because they are mixed in with all the tabs you have visited and purposely closed.

For example, if you opened a tab one week ago, and it got suspended and you never revisited it, then in Chrome history it will be grouped with all the tabs from one week ago.

You can search for `klbibkeccnjlkjkiokjodocebajanakg` in Chrome history to find tabs that were suspended. This may help narrow down the list.

If you find a lost tab in this list, there is a chance that when you try to reopen it, it will take you to a blank page saying "This site cannot be reached". Please refer to the section below.

---

### My suspended tab says "This site cannot be reached"

When you open a suspended tab link or try to unsuspend a tab, you may see a blank page with the text **"This site cannot be reached"** and a URL that looks like this:

```
chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html#ttl=Google&uri=https://www.google.com
```

This is most likely because The Great Suspender is no longer installed in your browser. The easiest fix is to reinstall the extension and then reload the page.

Should that fail (for example if you are opening the URL in Firefox, or on a device that does not support extensions such as an Android phone), you can manually edit the URL to recover the tab: delete everything before the `&uri=` text in the address bar and the page should reload correctly.

In the example above, you would end up with:

```
https://www.google.com
```
