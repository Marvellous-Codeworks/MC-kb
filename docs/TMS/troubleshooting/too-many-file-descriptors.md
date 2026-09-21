---
sidebar_position: 2
title: "Chrome crashes on Linux with many tabs (file descriptor limit)"
sidebar_label: "File descriptor limit (Linux)"
description: Why keeping hundreds of tabs open with TMS can hit Linux's default 1024 file-descriptor limit, and how to raise it.
tags:
  - TMS
  - The Marvellous Suspender
  - Linux
  - Debian
  - troubleshooting
---

# Chrome crashes on Linux with many tabs (file descriptor limit)

Most Linux distributions, Debian included, ship with a default **soft limit of 1024 open file descriptors per process**. Every open tab (and every process Chrome spins up for it) uses some of that budget. If you keep a very large number of tabs open at once, hitting that ceiling can cause Chrome to fail to open new tabs, or crash outright, with no clear error pointing at the actual cause.

This isn't a TMS bug, and it isn't specific to TMS either, any Chromium-based browser can hit it with enough tabs open. But TMS's whole point is letting you keep far more tabs open than you normally would (suspended tabs use a fraction of the memory of a live one), so people using it are more likely to actually reach a tab count high enough to hit this OS-level ceiling than people who don't.

## Why TMS can't detect this for you

There's no browser extension API that exposes the current file-descriptor count or the OS's ulimit setting, Chrome only discovers the problem itself when it fails to open a new tab, by which point it's too late to warn ahead of time. This means TMS has no reliable way to check for this in advance or work around it from inside the extension sandbox.

## How to raise the limit

Check your current limits:

```bash
ulimit -n
```

If it reports `1024`, you can raise it for your current session:

```bash
ulimit -n 4096
```

For a permanent change, add a line like this to `/etc/security/limits.conf` (requires root):

```
your-username soft nofile 4096
your-username hard nofile 8192
```

Then log out and back in for it to take effect. Some desktop environments/display managers also need `session required pam_limits.so` enabled in `/etc/pam.d/common-session` for the `limits.conf` change to apply to graphical sessions, not just terminal logins, check your distribution's documentation if the change doesn't seem to stick.

## See also

- [Reported in issue #510](https://github.com/gioxx/MarvellousSuspender/issues/510)
