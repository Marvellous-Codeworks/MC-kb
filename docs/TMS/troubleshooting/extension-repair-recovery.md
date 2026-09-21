---
sidebar_position: 1
title: "Chrome/Edge extension corruption and repair"
sidebar_label: "Extension corruption & repair"
description: What to do if Chrome or Edge flags TMS as corrupted and offers to repair it, and how to recover session data if that reset your local storage.
tags:
  - TMS
  - The Marvellous Suspender
  - recovery
  - backup
  - Chrome
  - Edge
---

# Chrome/Edge extension corruption and repair

Chromium-based browsers (Chrome, Edge) occasionally flag an installed extension as "corrupted" and prompt you to remove or repair it. This is a browser-side integrity check, unrelated to any specific TMS update, and it has been observed on both Chrome and Edge. See [issue #410](https://github.com/gioxx/MarvellousSuspender/issues/410) for the original report and the full recovery thread this page is based on.

![Chrome's extensions list showing a corrupted-extension repair warning](./img/extension-repair-recovery/01-repair-warning.webp)

---

## What actually happens

TMS pins a fixed extension ID via the `key` field in its manifest, so a "repair" reinstall does **not** change the extension ID. In principle that should leave `chrome.storage` and IndexedDB untouched. In practice, on some machines the repair flow resets the extension's local storage anyway, as a side effect of reinstalling its files, even though the ID stays identical before and after.

This is Chromium's own corruption/repair mechanism at work, not something a TMS update triggers. The most likely culprit is `computed_hashes.json`, a file-integrity manifest Chromium generates under the extension's install directory to detect tampering with the extension's own files. Its presence/absence lining up with what "repair" touches fits a check that's about the extension's *files*, not its *data*: storage gets reset as a side effect of the reinstall, not because anything was wrong with it.

Confirmed so far:
- Same behavior on **Chrome and Edge**.
- Extension ID stays identical before and after repair.
- Settings/whitelist and sessions are lost together, since both live under the same install, in different storage areas (see below).

---

## Where TMS actually stores things

Two separate storage areas are involved, both LevelDB-backed but different APIs, and a repair can reset either or both:

| Data | Storage API | Path (Chrome, adjust for Edge) |
|---|---|---|
| Sessions (recent + saved), same `tgs` database used by [Session management](../pages/session-management) | IndexedDB | `<profile>\IndexedDB\chrome-extension_<id>_0.indexeddb.leveldb\` |
| Settings, never-suspend whitelist | `chrome.storage.local` | `<profile>\Local Extension Settings\<id>\` |

"Recent sessions" and "saved sessions" are **not** in different locations, they're two object stores inside the same IndexedDB database, so one folder covers both.

If you'd already set up [automatic backup](../pages/backup-sync) (local or Google Drive) before the corruption hit, recovery is simple: just restore from your latest backup file via **Backup & Sync → Restore from backup**. The rest of this page is for when no such backup exists and you need to recover from raw browser profile data.

---

## Recovery steps

### 1. Check if anything is still there
Open **Session management** (from the popup, or right-click the icon → Options → Session management) and check **Recent sessions**. Also check if a [Recovery screen](../pages/system-pages#recovery-screen) appeared after the update, it looks for your last session automatically. If both are empty, local storage really was reset.

### 2. Compare extension IDs
Go to `chrome://extensions` (or `edge://extensions`), enable Developer mode, and note the current ID. Compare it to the folder name in any backup you have of the profile, `chrome-extension_<ID>_0.indexeddb.leveldb`. Matching IDs confirm any old data you find is still valid for the currently-running install, just not attached to it anymore.

### 3. Extract tab URLs from raw IndexedDB files (safest option)
IndexedDB stores tab URLs as plain UTF-8 text inside its `.ldb` and `.log` files, even though the file format itself isn't JSON. You can pull them out without touching Chrome's live profile at all, this works against any backup copy of the `indexeddb.leveldb` folder (system backup, "previous versions" snapshot, manual copy):

```powershell
Select-String -Path ".\chrome-extension_<ID>_0.indexeddb.leveldb\*.ldb",".\chrome-extension_<ID>_0.indexeddb.leveldb\*.log" -Pattern "https?://[^\x00-\x1f\"\\]+" -AllMatches |
  ForEach-Object { $_.Matches.Value } | Sort-Object -Unique | Out-File recovered-urls.txt
```

Clean up `recovered-urls.txt` a little (remove obvious garbage/duplicates, optionally separate windows with a blank line), then in **Session management**, use **Import** and select that `.txt` file to rebuild a session from the plain URL list. You lose favicons and titles, but get your tabs back.

If a snapshot only partially recovers data (e.g. recent sessions come back but saved sessions don't), run the same extraction pass against **every** file in the folder, not just whatever a structured reader already parsed. LevelDB spreads records across multiple `.ldb`/`.log` files depending on when they were written and whether they've been compacted, so a snapshot can catch some data mid-compaction while less-recently-touched records are still sitting only in an uncompacted `.log` file. A plain-text scan can still find URLs there even when a structured reader can't make sense of the file.

### 4. Restore the raw leveldb folder directly (riskier, last resort)
If the extension ID matches and you're comfortable with the risk: fully quit the browser, back up your current profile, then copy your saved `chrome-extension_<ID>_0.indexeddb.leveldb` folder back over the reset one at the same path, and relaunch. This has been **confirmed working end-to-end on Edge**. It isn't guaranteed on every version, since the storage-bucket architecture has changed internals over time, so treat it as a "nothing to lose" attempt on a backup copy of your profile, not your main one.

To bring back settings/whitelist as well, restore the matching `Local Extension Settings\<id>` folder the same way, alongside the IndexedDB one.

### 5. If nothing above turns anything up
There is no way for TMS to read from an arbitrary folder path you point it at, extensions can only open their own IndexedDB database for the profile they're running in. Steps 3 and 4 above are the only recovery paths that exist for this scenario, this is a platform limitation, not a UI gap.

---

## Avoiding this in the future

Turn on [automatic backup](../pages/backup-sync) (local or Google Drive). It exists specifically to reduce how often anyone needs the manual recovery process above. TMS also nudges you to enable it if it's been off for a while, see [Backup activation nudge](../pages/backup-sync#backup-activation-nudge).

---

## Related

- [Backup & Sync](../pages/backup-sync): set this up so raw-file recovery is never needed again
- [Session management](../pages/session-management): where recovered sessions are imported and reopened
- [Recovering lost tabs (TGS archive)](./tgs-recover-lost-tabs): the older recovery guide, for tabs lost when the extension itself is removed or disabled rather than corrupted/repaired
- [System & recovery pages](../pages/system-pages#recovery-screen): the in-extension recovery screen shown after a browser restart or crash
