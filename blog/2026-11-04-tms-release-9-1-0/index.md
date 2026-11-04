---
slug: tms-release-9-1-0
title: "The Marvellous Suspender 9.1.0 is live - tab groups, real screenshots and a calmer startup"
description: "9.1.0 is live on the Chrome Web Store: per-group and grouped-tab protections, native screenshots for tab previews with SnapDOM as the new page renderer, a startup that no longer reloads every suspended tab at once, Ukrainian, three security fixes and a long list of bug fixes."
date: 2026-11-04T09:45:00+01:00
authors: [gioxx, amargiovanni]
tags: [announcement, release, tms]
---

TMS 9.1.0 is [live on the Chrome Web Store](https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa) as of today. If you installed TMS from the Store, there's nothing to do: Chrome updates it by itself. To check, open `chrome://extensions` and look at The Marvellous Suspender's version.

:::tip[TL;DR]
- **9.1.0 is out**, on the [Chrome Web Store](https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa) and on [GitHub](https://github.com/gioxx/MarvellousSuspender/releases/tag/v9.1.0).
- **New**: tab group protections, native screenshots for previews, a setting for startup checks, Ukrainian.
- **Fixed**: browser freezes after a restart with lots of suspended tabs, and a long list of smaller bugs.
- **Security**: three advisories closed, [explained here](/blog/tms-9-1-0-security-advisories). 9.0.3 and earlier are affected, so make sure you're updated.
- **On a test build?** Please [switch back to the Store version](/docs/TMS/troubleshooting/help-test-a-fix).
:::

{/* truncate */}

## What's new

The [preview post](/blog/tms-9-1-0-on-its-way) goes through all of this in detail, and [the numbers post](/blog/tms-9-1-0-submitted) shows how much work went into it. In short:

- **Tab groups**: [never suspend a named group](/docs/TMS/pages/settings#never-suspend-tabs-in-the-following-tab-groups), [never suspend any tab in a group](/docs/TMS/pages/settings#never-suspend-tabs-in-a-tab-group), and suspend or unsuspend all the tabs *not* in a group, from the context menus or two bindable [keyboard shortcuts](/docs/TMS/pages/keyboard-shortcuts).
- **Tab previews**: the tab you're looking at is captured with a real browser screenshot, so YouTube, GitHub and other pages that came out blank now get a proper preview. Choose how with [Capture method](/docs/TMS/pages/settings#capture-method). SnapDOM replaces html2canvas as the page renderer.
- **[Keep a recent screenshot of tabs as I use them](/docs/TMS/pages/settings#keep-a-recent-screenshot-of-tabs-as-i-use-them)**: opt-in and off by default. It gives real previews to tabs suspended later in the background.
- **Startup**: restored suspended tabs are checked a few at a time, and [how many](/docs/TMS/pages/settings#suspended-tabs-checked-at-a-time-when-the-browser-starts) is now a setting, from 1 to 8, default 3.
- **Ukrainian** joins the supported languages, and Ukrainian and Sinhala now actually load when the language follows the browser. The [help tooltips](/blog/tms-tooltips-translators) are easier to translate and can be reached from the keyboard.

## What's fixed

The biggest fix is for browsers freezing, or TMS crashing, after a restart with lots of suspended tabs ([#523](https://github.com/gioxx/MarvellousSuspender/issues/523)). Also fixed: `file://` pages that couldn't be suspended from the popup, a context menu that could disappear, Drive auto-backups that didn't retry after a temporary failure, Tab Health false positives on grouped tabs, and a paused toolbar icon that was hard to tell from the active one. Discarded tabs are also no longer reloaded just to take a screenshot.

## Security

9.1.0 closes three security advisories, all reported privately and now public:

- [GHSA-qv22-cq95-fcqr](https://github.com/gioxx/MarvellousSuspender/security/advisories/GHSA-qv22-cq95-fcqr): HTML injection on the History page through a crafted backup filename.
- [GHSA-wxv6-36j4-qw5f](https://github.com/gioxx/MarvellousSuspender/security/advisories/GHSA-wxv6-36j4-qw5f): HTML injection on the suspended page and through locale strings.
- [GHSA-wh6f-63h6-wvq6](https://github.com/gioxx/MarvellousSuspender/security/advisories/GHSA-wh6f-63h6-wvq6): other extensions could suspend tabs while skipping your protections.

[The dedicated post](/blog/tms-9-1-0-security-advisories) explains what they were, who found them, and what you should do.

## Permissions

The update adds no new install warning. `activeTab` is used for the native screenshot of the tab being suspended, and access to all sites is requested only if you turn on "Keep a recent screenshot of tabs as I use them". The [Permissions page](/docs/TMS/permissions) has the details.

## If you're on a test build

If you installed `v9.1.0-test.523` or `v9.1.0-test.551`, it won't update by itself. Thank you for testing, and please [go back to the Store version](/docs/TMS/troubleshooting/help-test-a-fix).

## The documentation is now stable

As announced, what was the **Next** documentation is now the [stable TMS documentation](/docs/TMS/overview), and it describes 9.1.0. Next stays online for what comes after this release.

## What's next

The [9.1.1 milestone](https://github.com/gioxx/MarvellousSuspender/milestone/14) collects the follow-up fixes and the [Edge Add-ons Store](https://github.com/gioxx/MarvellousSuspender/issues/295) publication, while [Group Policy support](https://github.com/gioxx/MarvellousSuspender/issues/358) moved to 9.2.0.

## Thanks

This release belongs to the people who built it: **[@jadshaker](https://github.com/jadshaker)**, **[@ctsstc](https://github.com/ctsstc)**, **[@amargiovanni](https://github.com/amargiovanni)** and **[@hospotho](https://github.com/hospotho)**, **[@squeeze440](https://github.com/squeeze440)** for a very good security report, the Crowdin translators, and everyone who opened an issue, tested a pre-release build or sent a debug report. Thank you.

I wish you all the best on your journey.

*Giovanni*

---

*GitHub release, with the package and its checksum: [v9.1.0](https://github.com/gioxx/MarvellousSuspender/releases/tag/v9.1.0). Full changelog: [CHANGELOG.md](https://github.com/gioxx/MarvellousSuspender/blob/master/CHANGELOG.md#910--2026-11-04)*
