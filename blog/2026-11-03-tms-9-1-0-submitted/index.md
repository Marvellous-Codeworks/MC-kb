---
slug: tms-9-1-0-submitted
title: "The Marvellous Suspender 9.1.0, by the numbers: submitted to the Chrome Web Store"
description: "9.1.0 has been submitted to Google for review. Before it reaches everyone as an automatic update, a look at how much went into it: 400 commits, 54 pull requests, 44 closed issues, five people writing code, and a test suite that didn't exist two months ago."
date: 2026-11-03T12:00:00+01:00
authors: [gioxx]
tags: [release, tms]
---

TMS 9.1.0 is done, and as of today it is in Google's hands: the package has been submitted to the [Chrome Web Store](https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa) for review. Once it is approved, it will reach everyone who installed TMS from the Store as an automatic update, with nothing to do on your side.

[The 9.1.0 preview post](/blog/tms-9-1-0-on-its-way) already covers what's new. This one is about something else: how much work went into it, in numbers.

:::tip[TL;DR]
- **Submitted to Google today.** It arrives as an automatic update once the Store review is done, usually within a few days.
- **401 commits, 54 pull requests, 44 closed issues** since 9.0.3.
- **Five people wrote code** for this release, and more than half of the commits that weren't translations came from contributors and maintainers.
- **From zero to 29 test files**: around 290 unit tests and 19 end-to-end tests now run on every pull request.
- **18 languages, 446 strings each**, after a full retranslation and a tooltip rewrite that cut 36 strings per language.
:::

{/* truncate */}

## The numbers

Counted on the repository, from the 9.0.3 tag to the 9.1.0 release branch:

| | |
|---|---|
| Commits | **401**, plus 47 merges |
| Pull requests merged | **54** |
| Issues closed | **44** |
| Files changed | **116** |
| Lines added / removed | **~19,000** / **~7,800** |
| Changelog entries | **50**, of which 22 are fixes |

Of those 401 commits, 184 are translation syncs from [Crowdin](https://crowdin.com/project/tms): every time a volunteer translates or fixes a string, it lands in the repository as a commit. That's a lot of small contributions from people who never open a pull request, and it's why 9.1.0 ships with Ukrainian as a new language and a full retranslation of every other one.

The other 217 are code, tests and documentation. Of those, 117 came from contributors and maintainers.

## Who wrote it

For the first time, most of a TMS release wasn't written by me:

- **[@jadshaker](https://github.com/jadshaker)**, 54 commits: the whole tab groups feature set, the paused toolbar icon and a long trail of fixes around them.
- **[@amargiovanni](https://github.com/amargiovanni)**, 34 commits: the startup setting, the test harness, end-to-end tests in CI and the contributor guidelines.
- **[@hospotho](https://github.com/hospotho)**, 19 commits: much less repeated storage and database work when suspending or restoring many tabs at once.
- **[@ctsstc](https://github.com/ctsstc)**, 10 commits: the rebuilt screen capture stack, with native screenshots and SnapDOM.

Commit counts don't measure effort, though: some of these commits are a one-line fix, others are a feature that went through a dozen review rounds. They're here to show that this was a shared effort, not to rank anyone.

## Tests, finally

TMS 9.0.3 had no automated tests. 9.1.0 has 29 test files: about 290 unit tests and 19 end-to-end tests that load the packaged extension in a real browser and check it the way you use it. They run on every pull request, along with the linter and a check that every locale has every string.

You won't see any of this, but it's the reason a release this large could come together without breaking what already worked, and it's what will let future releases move faster.

## AI-assisted development, with rules

9.1.0 is also the first release where we openly accepted AI-assisted contributions. Not as a free-for-all: the rules are written down in the repository, and they apply to every pull request, whoever or whatever wrote the code.

- **[AGENTS.md](https://github.com/gioxx/MarvellousSuspender/blob/master/AGENTS.md)** is the policy for anyone changing the code, human or coding agent: what "done" means (tests pass, lint passes, the extension loaded and tried by hand), what is mandatory (a test with every fix and feature, no new dependencies or permissions without a maintainer's yes, no page or locale data written as HTML) and what is off limits. Its [Working with AI tools](https://github.com/gioxx/MarvellousSuspender/blob/master/AGENTS.md#working-with-ai-tools) section is short: AI-assisted code is welcome only if the person opening the pull request has read every line, run the tests and the extension, and can answer questions about it. The pull request says which parts were AI-assisted. One whose author can't explain it is closed without review.
- **[CONTRIBUTING.md](https://github.com/gioxx/MarvellousSuspender/blob/master/CONTRIBUTING.md)** covers the process around it: issues first for any feature, branches, review, and [using AI tools](https://github.com/gioxx/MarvellousSuspender/blob/master/CONTRIBUTING.md#using-ai-tools).
- **[MAINTAINERS.md](https://github.com/gioxx/MarvellousSuspender/blob/master/MAINTAINERS.md)** says who reviews and who decides. Releases and the Chrome Web Store listing stay with the maintainers.
- **[The pull request template](https://github.com/gioxx/MarvellousSuspender/blob/master/.github/PULL_REQUEST_TEMPLATE.md)** turns part of AGENTS.md into a checklist each pull request has to fill in.

We don't regret this choice. Every change still goes through review, the test suite above, and hands-on testing in a real browser before it ships, and we'll keep following the extension's development as closely as we always have. A tool doesn't change who answers for the code: we do.

If, for you, any AI involvement makes a project "slop", that's a legitimate position, and there are other suspenders out there that may suit your daily work better. No hard feelings at all.

## Translations

- **18 languages**, each with **446 strings**.
- **25 help tooltips**, now stored as 30 full paragraphs instead of 66 fragments cut by hand, which is why every language went from 482 to 446 strings. The [tooltips post](/blog/tms-tooltips-translators) has the details.
- **Ukrainian** added, and Ukrainian and Sinhala now actually load when the language is set to "auto".

## What happens now

Google reviews every new version before it is published. When the review is done, Chrome installs 9.1.0 by itself, usually within a few hours of the release going live. If you want to check, open `chrome://extensions` and look at The Marvellous Suspender's version.

If you installed TMS from source or from a test build, you can [update it yourself](/docs/TMS/next/tms-install-from-source) as soon as the release is tagged on GitHub.

## The documentation becomes stable

The documentation for 9.1.0 is already written, and today it lives under the **Next** version of the docs: [docs/TMS/next](/docs/TMS/next/overview). As soon as 9.1.0 is live on the Chrome Web Store, Next becomes the stable documentation: it will be what you get from the Docs menu and the TMS links on this site, and it will replace the 9.0.3 docs, since we only keep the stable version and Next online.

I'll post again when it is live on the Store.

Thanks to everyone who contributed code, translations, bug reports and test sessions. A release this size only happens because many people chose to spend some of their time on it.

I wish you all the best on your journey.

*Giovanni*
