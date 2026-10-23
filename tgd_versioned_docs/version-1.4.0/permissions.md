---
sidebar_position: 5
title: "Permissions"
description: What permissions The Great-er Tab Discarder requests and why each one is needed.
tags:
  - TGD
  - The Great-er Tab Discarder
  - permissions
  - privacy
---

# Permissions

TGD requests only the permissions it needs to function. This page explains what each permission does and why it is required.

:::info[Current version]
The permission list below reflects TGD **1.x** (Manifest V3), minimum Chrome version **108**.
:::

---

## Required permissions

### `tabs`
Grants access to the list of open tabs and their properties (URL, title, active state, pinned state, audio status). This is the core permission; without it, TGD cannot read or manage tabs.

### `storage`
Used to persist your settings, whitelist, and options. All data is stored locally in your browser profile.

### `contextMenus`
Adds TGD commands to the right-click context menu on tabs (discard, suspend, pause, etc.). Can be disabled in **Settings → Other → Add to right-click context menu**.

### `alarms`
Manifest V3 extensions cannot use `setTimeout` reliably across service worker restarts. `alarms` is the scheduling mechanism TGD uses to track which tabs have been inactive long enough to be discarded or suspended.

### `favicon`
Reads the favicon of each tab so TGD can display it on the suspended page, and apply favicon modifications (e.g. dimming) to suspended tabs.

---

## Optional permissions

### `tabGroups`
Grants access to Chrome's Tab Groups API. Used by the Profiler page to display tab group membership alongside each tab. This permission is optional and requested only when the feature is used.

---

## Privacy

TGD does not collect, transmit, or sell any user data. All storage (settings, whitelist) is local to your browser profile. The optional **Sync settings** feature uses Chrome's built-in sync mechanism, nothing passes through any Marvellous Codeworks server.

The source code is [publicly available on GitHub](https://github.com/rkodey/the-great-er-discarder-er) for independent review.
