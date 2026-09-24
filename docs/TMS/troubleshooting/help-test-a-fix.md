---
sidebar_position: 3
title: "Helping test a fix before it ships"
sidebar_label: "Help test a fix"
description: How to install a maintainer-provided test build attached to a GitHub issue, what to check, and how to go back to the Store version afterward.
tags:
  - TMS
  - The Marvellous Suspender
  - testing
  - GitHub
  - Chrome
---

# Helping test a fix before it ships

Sometimes, while a bug is being investigated, a maintainer attaches a test build (a `.zip`) directly to the GitHub issue and asks people affected by it to try it before the fix ships in a real release. This page covers that workflow in general, see [issue #437](https://github.com/gioxx/MarvellousSuspender/issues/437) for a real example of how one of these threads plays out end to end.

Testing is entirely optional and always welcome, more real-world runs on a fix before it ships means fewer surprises for everyone once it does.

---

## Before you install it

**It's the same extension ID as the Store version.** A test build replaces your currently installed TMS and shares its local data, it cannot run side by side with the Store version. Loading it is what actually starts the test, there's no separate "try without installing" option.

- If you already have **[Sync settings across devices](../pages/settings#sync-settings-across-devices)** and/or **[automatic session backup](../pages/backup-sync#automatic-session-backup)** enabled, you're already covered, both survive the switch either way.
- Otherwise, as a safety net before installing: export your settings (Settings → export) and save your current sessions as JSON (Session Manager → save/export).

## Installing the test build

1. Download the `.zip` the maintainer attached to the issue and extract it.
2. In Chrome (or Brave/Vivaldi/Edge), go to `chrome://extensions/` and enable **Developer mode**.
3. Click **Load unpacked extension…** and browse to the extracted folder's `src` directory.

This replaces your current installation. See [Install from source](../tms-install-from-source) for more detail on this general mechanic if anything looks unfamiliar.

:::note
Test builds usually keep the same version number as the last real release, a test build isn't a new release on its own, just that fix layered on top for testing purposes. That's expected, not a sign something didn't install.
:::

## What to test

Follow whatever specific steps the maintainer asked for on the issue, they vary per fix. As a general shape: try to reproduce the exact problem you originally reported, the way you'd normally hit it (not just once, artificially), and report back whether it still happens.

If the fix is timing- or condition-dependent (a backup reconnecting after some hours, a crash needing many tabs), a longer, more realistic test run is far more useful than a quick artificial one, say so either way when you report back.

## If something looks off

Open the [Diagnostic page](../pages/diagnostic-page), enable **captureLogs**, reproduce the issue, then use **Copy report** or **Download report**. This bundles your TMS version, browser details, and recent logs into one shareable block, far more useful to a maintainer than a description alone. It can also include tab titles/URLs, so upload it to [logdrop](https://logdrop.marvellouscode.works) instead of pasting it into the issue thread, only the maintainer can read it, and it expires on its own.

## Going back to the Store version afterward

Once the fix has shipped for real (or if you'd rather stop testing), remove the local build from `chrome://extensions/` and install the Chrome Web Store version again.

- If you have Drive backup or settings sync enabled, sign back in and your data restores from there.
- Otherwise, import the session file you exported before installing (Session Manager → import), or restore from a local backup file if [automatic backup](../pages/backup-sync#automatic-session-backup) was on.

Removing the local build first and installing from the Store after is what keeps you on automatic Store updates going forward, installing over the top the other way around does not.
