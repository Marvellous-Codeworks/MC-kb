---
slug: tms-9-1-0-security-advisories
title: "Three security fixes in The Marvellous Suspender 9.1.0, and the people who found them"
description: "9.1.0 closes three security advisories: HTML injection on the History page through a crafted backup file, HTML injection on the suspended page and through locale strings, and other extensions bypassing your suspension protections. What they were, who found them, what changed, and what you should do."
date: 2026-11-04T09:30:00+01:00
authors: [gioxx]
tags: [security, release, tms]
---

TMS 9.1.0 is now on the [Chrome Web Store](https://chromewebstore.google.com/detail/the-marvellous-suspender/noogafoofpebimajpfpamcfhoaifemoa), and with it we are publishing three security advisories that it closes. All three were reported privately, through the process described in our [security policy](https://github.com/gioxx/MarvellousSuspender/security/policy), and kept private until the fixed version was available to everyone. This post explains what they were, credits the people who found them, and describes what changed.

:::tip[TL;DR]
- **Update to 9.1.0.** Chrome does this automatically. You can check your version under `chrome://extensions`. 9.0.3 and earlier are affected.
- **[GHSA-qv22-cq95-fcqr](https://github.com/gioxx/MarvellousSuspender/security/advisories/GHSA-qv22-cq95-fcqr)** (moderate): a backup file with HTML in its filename could inject markup into the History page. Reported by **[@squeeze440](https://github.com/squeeze440)**.
- **[GHSA-wxv6-36j4-qw5f](https://github.com/gioxx/MarvellousSuspender/security/advisories/GHSA-wxv6-36j4-qw5f)** (moderate): any web page could inject markup into the suspended-tab page, and a malicious translation could do the same on any extension page. Reported and fixed by **[@amargiovanni](https://github.com/amargiovanni)**.
- **[GHSA-wh6f-63h6-wvq6](https://github.com/gioxx/MarvellousSuspender/security/advisories/GHSA-wh6f-63h6-wvq6)** (low): any other installed extension could suspend your tabs while skipping the protections you set, losing unsaved form input. Reported by **@amargiovanni**.
- None of these allowed running code: the extension's Content Security Policy blocks scripts on its pages. The risk was believable fake content (links, forms) shown on a page that looks like, and runs as, TMS.
:::

{/* truncate */}

## Why "no code execution" still matters

The first two advisories are the same kind of bug: data the extension does not control (a filename, a URL, a translated string) was written into a page as HTML instead of as text. On a normal website that is often enough to run JavaScript. On TMS's own pages it is not, because Chrome enforces the extension's Content Security Policy (`script-src 'self'`), and that blocked every script we and the reporters tried.

What it does not block is markup. An attacker could still place links, buttons and forms on a page served from the extension's own address, styled like TMS. That is a convincing place for a fake "restore your tabs" prompt or a login form that sends your credentials elsewhere. So we treated these as real vulnerabilities, not as theoretical ones.

## GHSA-qv22-cq95-fcqr: a backup filename that became HTML on the History page

**Reported by [@squeeze440](https://github.com/squeeze440). Severity: moderate.**

When you restore a backup from a local file (Options → Backup & Restore → "Restore from local file"), TMS names the restored session after the file. The History page then showed that name using raw HTML. A file called, for example, `<img src=x>.json`, containing a valid backup, became a saved session whose name rendered as a live element every time you opened the History page, and it stayed there until you deleted that session.

It needed you to import a file someone gave you, but sharing session backups is a feature TMS advertises, so that is a plausible request.

**The fix:** saved session names are now always shown as text. This also covers names you type yourself when saving a session.

@squeeze440's report was a model of what a security report should be: the exact source path from the filename to the page, a proof of concept, a careful CVSS rating explaining why the CSP lowered the impact, and a suggested fix. Thank you.

## GHSA-wxv6-36j4-qw5f: markup on the suspended page and in translations

**Reported and fixed by [@amargiovanni](https://github.com/amargiovanni). Severity: moderate.**

This one had two paths.

1. **The suspended-tab page, from any web page.** `suspended.html`, the page a suspended tab shows, can be opened by any website (it has to be, for suspended tabs to work). It accepted an older `url=` parameter in its address and wrote the decoded value into the top bar as HTML. A website could link to a crafted placeholder address and have links and form controls appear on a page under the extension's name.
2. **Translations.** Translated strings were also inserted as HTML on every extension page. Translations come from the community through Crowdin and are reviewed before they're merged, so this needed a malicious translation to get through review, but if one did, it could place markup on any TMS page.

While fixing it, two more places of the same kind turned up and were fixed too: saved session names on the History page (the same sink as the advisory above, reached from another direction) and the tab table on the debug page (tab group titles and favicon addresses).

**The fix:** the suspended page now shows the original address and title as text. Translations are rendered through a small allow-list that keeps the few tags our strings actually use (`b`, `br`, `em`, `i`, `strong`, without attributes) and shows anything else as plain text. The debug page and the popup's status links are built as elements instead of HTML strings. New end-to-end tests run the original proof-of-concept address and a translation containing a link, and check that neither creates an element.

## GHSA-wh6f-63h6-wvq6: other extensions could skip your protections

**Reported by [@amargiovanni](https://github.com/amargiovanni). Severity: low.**

TMS inherited from The Great Suspender a way for other extensions to ask it to suspend or unsuspend a tab. Any installed extension could use it, with no permissions of its own, and the request ran at a level that skipped the protections you set: the whitelist, pinned tabs, tabs playing audio, the active tab, protected tab groups, and the check for unsaved form input. An extension could suspend a tab with text you had typed but not submitted, then unsuspend it, and that text was gone.

It needs a hostile or compromised extension already installed in your browser, and it does not let that extension read anything, which is why it is rated low.

**The fix:** requests from other extensions now run at the same level as automatic suspension, so every protection you set applies to them too. Integrations that use this interface keep working; they just can't override you anymore. A test now pins that level so it can't silently regress.

## What you should do

- **Make sure you're on 9.1.0.** Chrome updates extensions automatically. If you want to check, open `chrome://extensions` and look at The Marvellous Suspender's version.
- **Only restore backup files you made yourself, or that come from someone you trust.** That's good practice in general, not just for this bug.
- **If you see a saved session with a strange name on the History page**, delete it. With 9.1.0 it can no longer render as anything but text, but there's no reason to keep it.

## Thanks

Security reports take time and care, and getting them in private, with enough detail to fix the problem properly, is the best thing that can happen to a project like this. Thank you to **[@squeeze440](https://github.com/squeeze440)** for GHSA-qv22-cq95-fcqr, and to **[@amargiovanni](https://github.com/amargiovanni)** for finding GHSA-wxv6-36j4-qw5f and GHSA-wh6f-63h6-wvq6, writing most of the fixes, and testing the release branch before it shipped.

If you find something that looks like a security problem in TMS, please don't open a public issue: follow the [security policy](https://github.com/gioxx/MarvellousSuspender/security/policy) and report it privately.

*Giovanni*

---

*Full changelog on GitHub: [CHANGELOG.md](https://github.com/gioxx/MarvellousSuspender/blob/master/CHANGELOG.md)*
