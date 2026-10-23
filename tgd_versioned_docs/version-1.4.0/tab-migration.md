---
sidebar_position: 4
title: "Migrating tabs from other extensions"
description: How to migrate suspended tabs from The Marvellous Suspender, The Great Suspender, Tab Suspender, and Tiny Suspender to The Great-er Tab Discarder.
tags:
  - TGD
  - The Great-er Tab Discarder
  - migration
  - TMS
---

# Migrating tabs from other extensions

If you are switching to TGD from another tab management extension, TGD can convert your existing suspended tabs so you do not lose them. Open the migration tool from **Options → Migrate Tabs**.

---

## Supported sources

| Extension | Suspended page format |
|-----------|----------------------|
| The Marvellous Suspender | `suspended.html` |
| The Great Suspender (notrack) | `suspended.html` |
| The Great Suspender (original) | `suspended.html` |
| Tab Suspender | `park.html` |
| Tiny Suspender | `suspend.html` |

---

## How migration works

1. Open **Options → Migrate Tabs**
2. TGD scans all open tabs for suspended pages it recognises
3. The migration page lists the eligible tabs, you can **select which ones** to migrate individually rather than converting everything at once
4. Click **Migrate** (or **Convert**) on the selected tabs

Migrated tabs are converted to TGD's own `suspended.html` format. The original URL is preserved, so the tab will reload correctly when you activate it.

---

## Tips

- You do not need to uninstall the source extension before migrating, TGD detects the suspended pages regardless of whether the original extension is still installed
- If a migrated tab shows a blank page after conversion, try reloading it; the original URL is embedded in the TGD suspended page URL and will load correctly
- For large sessions, migrate in batches to avoid opening too many tabs at once during conversion
