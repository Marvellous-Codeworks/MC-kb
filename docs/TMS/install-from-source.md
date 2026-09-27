---
sidebar_position: 3
title: "Install from source"
description: How to install or build The Marvellous Suspender from source code.
id: tms-install-from-source
tags:
  - TMS
  - The Marvellous Suspender
  - install
---

# Install from source

Installing TMS from source is useful when you want to test a pre-release build, contribute to development, or load the extension in a browser that cannot access the Chrome Web Store.

If you're here because a maintainer attached a test build to a GitHub issue and asked you to try it, see [Helping test a fix before it ships](./troubleshooting/help-test-a-fix) instead, it covers that specific workflow (safety net, what to test, going back to the Store version afterward).

> Requires **Google Chrome 110 or later** (Manifest V3).

## Option A: Load a release archive

1. Download the **[latest release](https://github.com/gioxx/MarvellousSuspender/releases)** and unarchive it to a folder of your choice.
2. In Chrome, navigate to `chrome://extensions/` and enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked extension…**.
4. Browse to the `src` directory inside the unarchived folder and confirm.

The TMS welcome page will open to confirm successful installation.

:::warning[Unsuspend before removing older versions]
Before removing any previous version of TMS, unsuspend all tabs, suspended tabs belonging to a removed extension disappear permanently.
:::

## Option B: Build from source

### Prerequisites

- `node` / `npm`
- `openssl`

### Steps

```sh
git clone https://github.com/gioxx/MarvellousSuspender.git
cd MarvellousSuspender
npm install
npm run generate-key
npm run build
```

The build output ends with:

```
Done, without errors.
```

You will find:
- `build/crx/`: the extension packaged as `.crx`
- `build/zip/`: a `.zip` archive you can load as unpacked

### Loading the built extension

**From `.crx`**: drag the file into `chrome://extensions/`.

**If Chrome blocks the `.crx`**: extract the `.zip` from `build/zip/`, open `chrome://extensions/`, click **Load unpacked extension…**, and browse to the extracted folder.

> Chrome may show **"This extension is not listed in the Chrome Web Store"** for sideloaded builds. This is expected behavior for locally loaded extensions.
