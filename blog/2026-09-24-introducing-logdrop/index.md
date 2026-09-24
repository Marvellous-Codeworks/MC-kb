---
slug: introducing-logdrop
title: "Introducing logdrop: a private way to share debug reports"
description: "logdrop is a small, self-hosted, PrivateBin-style drop-off for TMS diagnostic reports: no account to upload, auth-gated reads, auto-expiring. Use it instead of pasting a captureLogs report into a public GitHub issue."
date: 2026-09-24T15:30:00+02:00
authors: [gioxx]
tags: [announcement, tms]
---

Diagnosing a tricky TMS bug often means asking for a `captureLogs`/`debug.html` report from the [Diagnostic page](/docs/TMS/pages/diagnostic-page). Those reports are genuinely useful, they bundle your TMS version, browser details, and recent logs into one shareable block, but they're also a dump of real browser state: open tab titles and URLs, timestamps, sometimes local file paths. Pasting that directly into a GitHub issue makes it **public and permanent**, sitting in a thread that has nothing to do with the data itself.

{/* truncate */}

## What logdrop does

[logdrop](https://github.com/Marvellous-Codeworks/logdrop) is a small, self-hosted, [PrivateBin](https://github.com/PrivateBin/PrivateBin)-style drop-off, live now at [logdrop.marvellouscode.works](https://logdrop.marvellouscode.works):

- **No account needed to upload.** Paste or drop your report, get a link back.
- **Reading a capture requires maintainer auth.** Even if the link ends up pasted somewhere public, it's useless to anyone but me.
- **Uploads auto-expire on their own**, no cleanup needed on either side. If you lose track of your own link, just capture and upload again, it's cheap to redo.

## Privacy and security notes

A few things worth being explicit about, since this exists specifically to handle data you'd rather not have sitting in public:

- **The upload itself travels over HTTPS** and lands on the same hosting as the rest of `marvellouscode.works`, not a third-party paste service.
- **Only an authenticated maintainer session can read a capture.** The upload link alone isn't a secret you have to protect, if it leaks, there's nothing to read behind it.
- **Auto-expiry is enforced on the storage side**, not by a cleanup job that could fail silently. Once a capture's TTL is up, it's gone, there's no "soft delete" or backup copy sitting around afterward.
- **This isn't end-to-end encrypted like PrivateBin itself is.** Since reads already require maintainer auth, we skipped client-side encryption for now to keep the tool simple, it's still a listed open question for later, not a settled no.
- A capture only ever contains what your browser already showed you in `debug.html`, TMS doesn't collect or transmit anything beyond that on its own, logdrop is just a safer place to *put* it than a public issue thread.

## How to use it for a TMS bug report

Instead of pasting a `captureLogs`/`debug.html` report straight into a GitHub issue or comment:

1. Open the [Diagnostic page](/docs/TMS/pages/diagnostic-page), enable **captureLogs**, reproduce the issue, then **Copy report** or **Download report**.
2. Upload it to [logdrop.marvellouscode.works](https://logdrop.marvellouscode.works).
3. Paste the link it gives you into the issue instead of the raw report.

The bug report template, the [FAQ](/docs/TMS/faq), the [Diagnostic page](/docs/TMS/pages/diagnostic-page) guide, the [test-build troubleshooting page](/docs/TMS/troubleshooting/help-test-a-fix), and the [report form](https://marvellouscode.works/tms/report) on the site all point here now.

Tab Health scan reports (favicon/tab-group repair results) aren't affected, they're counts and status labels, not tab content, so pasting those directly into an issue is still fine.

This came out of [#518](https://github.com/gioxx/MarvellousSuspender/issues/518). A few things are still open for later: uploading straight from TMS's own diagnostic UI instead of copy/paste, rate-limiting on the public upload endpoint, and whether client-side encryption is worth the added complexity given reads are already auth-gated.

## It's not just for us

The [logdrop repo](https://github.com/Marvellous-Codeworks/logdrop) is public and open source, this isn't a TMS-only tool bolted onto our infrastructure. If you run your own project and want the same "reporters upload freely, only you can read it, it expires on its own" flow for your own bug reports or support requests, deploy your own instance, it's designed to be self-hosted by anyone. The one at [logdrop.marvellouscode.works](https://logdrop.marvellouscode.works) is simply the instance we run and keep available for TMS users specifically, it's not a shared public service for unrelated projects.

We're wide open to questions, suggestions, and contributions from outside on the project itself, [issues and pull requests](https://github.com/Marvellous-Codeworks/logdrop) are welcome if you want to help make logdrop better.

*Giovanni*
