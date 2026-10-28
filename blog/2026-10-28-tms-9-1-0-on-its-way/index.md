---
slug: tms-9-1-0-on-its-way
title: "The Marvellous Suspender 9.1.0 is on its way - tab groups, real screenshots and a calmer startup"
description: "9.1.0 is wrapping up and heading to the Chrome Web Store: per-group and grouped-tab protections, native screenshots for tab previews with SnapDOM as the new page renderer, a startup that no longer reloads every suspended tab at once, Ukrainian, and a long list of fixes."
date: 2026-10-28T12:00:00+01:00
authors: [gioxx]
tags: [release, tms]
---

TMS 9.1.0 is in its final stretch and will be on its way to the [Chrome Web Store](https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa) shortly. It is the biggest release since 9.0, and for the first time most of it was not written by me: tab groups, screen capturing, startup recovery and a good chunk of the fixes came from contributors. So before it lands, here is what's coming, and who to thank for it.

:::tip[TL;DR]
- **Tab groups**: never suspend a specific named group, or every tab in any group, plus suspend/unsuspend all the tabs *not* in a group.
- **Tab previews**: the active tab is now captured with a real browser screenshot, and the page renderer moved from html2canvas to SnapDOM. Discarded tabs are no longer reloaded just to take a screenshot.
- **Startup**: restoring a browser with lots of suspended tabs no longer reloads them all at once. How many are checked at a time is now a setting.
- **Ukrainian** is a supported language, and Ukrainian and Sinhala now actually load when the language is set to "auto".
- **Fixes**: `file://` tabs, a context menu that could vanish, Drive auto-backup retries, Tab Health false positives on grouped tabs, a clearer paused toolbar icon, and more.
:::

{/* truncate */}

## What's new

### Tab groups, properly

The [tab-groups feature set](https://github.com/gioxx/MarvellousSuspender/issues/133) that started with "suspend/unsuspend every tab in this group" in 9.0.3 is complete in 9.1.0, almost entirely thanks to **[@jadshaker](https://github.com/jadshaker)**:

- **[Never suspend this tab group](/docs/TMS/next/pages/settings#never-suspend-tabs-in-the-following-tab-groups)**: right-click a page or a tab and pick "Never suspend this group". The exemption is persistent and works on named groups, matched by name and colour (Chrome's own group ids change across restarts). Rename the group and the exemption follows it. Options lists every exempt group, with how many open groups each one matches, so you can undo it from there too.
- **[Never suspend tabs in a tab group](/docs/TMS/next/pages/settings#never-suspend-tabs-in-a-tab-group)**: a new checkbox next to the pinned, audio and app-window protections. Off by default, so nothing changes unless you turn it on.
- **Suspend/unsuspend all tabs not in a group**: the counterpart to the group actions, for the loose tabs left outside every group. Available from both context menus and as two bindable [keyboard shortcuts](/docs/TMS/next/pages/keyboard-shortcuts).

The popup now tells you when a tab is protected by its group. None of these protections is absolute, though, and that's now spelled out too: a help tooltip on each "Never suspend…" option says what can still override it (a direct "suspend this tab", or a URL on your always-suspend list).

### Tab previews that actually look like the page

If you use screen capturing, this is the change you'll notice first. Thanks to **[@ctsstc](https://github.com/ctsstc)**, who rebuilt the whole capture stack:

- **[Capture method](/docs/TMS/next/pages/settings#capture-method)**: on "Automatic", the default, the tab you're looking at is captured with a native browser screenshot. It takes a few milliseconds and works on sites the old renderer simply couldn't draw: YouTube, GitHub, anything built with modern CSS colours. Background tabs still go through the page renderer, since no browser API can screenshot a tab that isn't on screen. If one method fails, the other takes over.
- **SnapDOM replaces html2canvas** as the page renderer. html2canvas threw on modern CSS (including our own homepage) and choked on cross-origin images. SnapDOM handles both, with a hard render deadline so a stubborn page can't hold a suspension hostage.
- **[Keep a recent screenshot of tabs as I use them](/docs/TMS/next/pages/settings#keep-a-recent-screenshot-of-tabs-as-i-use-them)**: opt-in, off by default. TMS keeps a recent native screenshot of the tabs you use, so tabs suspended later in the background get a real preview too. It needs an extra permission, requested only when you turn it on and removed when you turn it off, and it never captures incognito or allowlisted tabs.
- **No more reload just to take a screenshot**: a tab Chrome's Memory Saver had already discarded used to be reloaded from the network so TMS could capture it. Not anymore.

### A calmer startup with lots of suspended tabs

Restoring a browser session with dozens of suspended tabs used to trigger a burst of reloads, enough to freeze the browser or crash TMS on some setups ([#523](https://github.com/gioxx/MarvellousSuspender/issues/523)). 9.1.0 checks restored tabs a few at a time, active tabs first, leaves the background ones asleep, and gives up cleanly on a tab that doesn't answer instead of retrying forever.

Thanks to **[@amargiovanni](https://github.com/amargiovanni)**, the number of tabs checked at once is now a setting: [Suspended tabs checked at a time when the browser starts](/docs/TMS/next/pages/settings#suspended-tabs-checked-at-a-time-when-the-browser-starts), from 1 to 8, default 3. If your browser still struggles after a restart, lower it. The [FAQ](/docs/TMS/next/faq#my-browser-froze-or-tms-crashed-after-a-restart-with-many-suspended-tabs-what-can-i-do) has the details.

### Ukrainian, and languages that actually load

Ukrainian joins the supported languages, fully translated thanks to a community volunteer on Crowdin. Along the way we found that Ukrainian and Sinhala had never loaded on "auto": their folders used codes Chrome doesn't recognise, so Chrome quietly fell back to English. Fixed, and if you had picked one of them by hand, your choice is kept. Every other language also got a full retranslation, with context in mind rather than string by string.

## What's fixed

- **`file://` tabs** still couldn't be suspended from the popup even with "Allow access to file URLs" on: that browser toggle only lets TMS *ask* for the permission. The [system pages](/docs/TMS/next/pages/system-pages) now walk you through the second step.
- **The right-click menu could vanish** on some browsers (reported on Opera GX) and not come back until the next update. It is now rebuilt whenever needed, and on Chrome 147 and older, which refuse the tab-strip menu, the page menu stays in place.
- **Drive auto-backup**: a one-off upload failure (a network blip, a server hiccup) now retries a few minutes later, instead of silently waiting for the next scheduled backup, up to a day away.
- **Tab Health** flagged healthy grouped tabs as broken on Chrome 150+, hiding the favicon restore step.
- **The paused toolbar icon** was hard to tell from the active one at 16px. It now carries an orange pause badge (thanks @jadshaker). The classic artwork keeps its grey icon.
- **Settings sync**: two quick changes to the same setting could end on the older value, and turning a group exemption on or off could overwrite a change synced from another device.
- **Smaller fixes**: favicons found through the root hostname (the YouTube case) were never cached, the Screen capturing help tooltip never showed up on the Settings page, a tab could be suspended twice if its status changed mid-suspension, and duplicate rows could pile up in the previews and favicon stores.

There's also work you won't see but will benefit from: **[@hospotho](https://github.com/hospotho)** cut a lot of repeated storage and database work when suspending or restoring many tabs at once, and @amargiovanni added a test harness, end-to-end tests on the packaged extension running in CI, and contributor guidelines for the project.

## Thanks

This release belongs to the people who built it: @jadshaker, @ctsstc, @amargiovanni and @hospotho, the Crowdin translators, and everyone who opened an issue, tested a pre-release build or sent a debug report. Thank you.

The [docs](/docs/TMS/next/overview) are already updated for 9.1.0, and from now on they always describe the latest version. 9.1.0 will show up as an automatic update once the Store review is done, and I'll post again when it's live.

I wish you all the best on your journey.

*Giovanni*

---

*Full changelog on GitHub: [CHANGELOG.md](https://github.com/gioxx/MarvellousSuspender/blob/master/CHANGELOG.md)*
