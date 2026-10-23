---
sidebar_position: 2
title: "Settings reference"
description: Complete reference for all settings available in The Great-er Tab Discarder.
tags:
  - TGD
  - The Great-er Tab Discarder
  - settings
  - configuration
---

# Settings reference

Open the TGD settings from the extension popup, or navigate to `chrome://extensions/` → The Great-er Tab Discarder → **Details** → **Extension options**.

Settings are saved automatically, there is no Save button.

---

## General Settings

### Automatic mode

The main toggle switches between two automatic behaviours:

| Mode | Behaviour |
|------|-----------|
| **Discard** (default) | Unloads the tab's content via the native browser discard API. Frees the most memory; the tab reloads automatically when you switch back to it. |
| **Suspend** | Replaces the tab with a lightweight suspended page. Frees less memory than Discard but allows visual customization (title prefix, favicon dimming). |

### Discard / Suspend tabs after

How long a tab must be inactive before it is automatically processed. Options range from **Never** to **3 days**. Set to **Never** to disable automatic processing entirely (manual actions still work).

### Do not Discard/Suspend pinned tabs

Pinned tabs are excluded from automatic processing when this is enabled.

### Do not Discard/Suspend tabs that are playing audio

Tabs with active audio (music, video, calls) are skipped.

### Only auto-Discard/Suspend if connected to the internet

Pauses automatic processing when the browser detects no internet connection.

### Only auto-Discard/Suspend if running on battery

Activates automatic processing only when the computer is running on battery power, leaving performance headroom when plugged in.

---

## Browser Startup

### Prevent reloading all tabs

By default, Chrome lazily reloads all tabs after a browser restart. Enabling this option discards all tabs at startup instead, keeping them visible but unloaded. This prevents Chrome from consuming memory and network bandwidth re-fetching every tab at once.

This option also works well with Suspended tabs: suspended tabs at startup stay suspended rather than being reloaded.

---

## Whitelist

A list of URL patterns that should never be automatically discarded or suspended. Enter one pattern per line.

Examples:

```
https://mail.google.com
google.com
/^https:.*github\.com/
```

- **Exact or partial URL**: `google.com` matches any URL containing that string
- **Regular expression**: enclose in forward slashes: `/^https:.*google\.com/`

---

## Suspended Page Settings

Access via **Options → Suspend Settings**.

### Click anywhere on the Suspended page to restore it

When enabled, clicking anywhere on the suspended page (not just a specific button) unsuspends the tab.

### Reload the Suspended page to restore it

When enabled, pressing the browser's Reload button (or keyboard shortcut) on a suspended tab unsuspends it.

### Favicon modification

Controls how the favicon is displayed for suspended tabs.

| Value | Behaviour |
|-------|-----------|
| **None** | Favicon is unchanged |
| **Dim** | Favicon is visually dimmed to make suspended tabs easy to spot at a glance |

---

## Other

### Add to right-click context menu

Adds TGD commands to the browser's right-click context menu on tabs.

### Sync settings between different systems

Syncs your TGD configuration via your Google account using Chrome's sync storage. Turning this on will overwrite settings on all synced systems the first time it is enabled.

### Enable debug links on context and popup menus

Adds links to Chrome's internal `chrome://discards` page in the context menu and popup. Useful for diagnosing which tabs are discarded and why.
