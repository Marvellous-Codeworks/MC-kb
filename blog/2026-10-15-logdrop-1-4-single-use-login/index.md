---
slug: logdrop-1-4-single-use-login
title: "logdrop 1.4: login links that work once"
description: "logdrop 1.4.0 reworks admin sign-in: single-use magic links, a confirmation step that survives mail scanners, sessions bound to one browser for at most 8 hours, and a real sign out. Plus a Deploy with Vercel button."
date: 2026-10-15T18:00:00+02:00
authors: [gioxx]
tags: [release, logdrop]
---

logdrop has no passwords: maintainers sign in with a link emailed to an allow-listed address. Until today that link had a problem I didn't like. It was valid for 15 minutes, and during those 15 minutes **anyone who had it could use it, as many times as they wanted, from as many browsers as they wanted**, and every use opened its own 7-day session. A login link should be a key you use once, not a pass that works for a quarter of an hour. logdrop **1.4.0** fixes that, and rethinks sessions along the way.

{/* truncate */}

## Login links now work once

- A link works **once**, within 15 minutes of being requested. Use it a second time, from any browser, and you get *"That link expired or was already used"*.
- Requesting a new link cancels the previous one.
- The link no longer carries your email address, just a random token. The instance stores only a hash of it, so neither the token nor your address sits in storage.

There's a catch with single-use links: many mail systems, Microsoft Defender Safe Links for one, open every link in advance to scan it. If opening the link were enough to sign in, the scanner would burn it before you ever clicked. So opening the link now only shows a **Sign in** button, and the link is used when you press it. One extra click, and it works behind corporate mail filters too.

## Sessions live in one browser

- The session cookie has no expiry date, so it ends with your browser session. Another browser or device needs a new link.
- Whatever the browser does with that cookie (some browsers restore session cookies when you reopen them), the server ends every session **8 hours** after sign-in. Enough for a day of triage, not a week of open door.
- **One session per admin**: signing in on a second browser or device signs you out of the first. If someone ever signs in with your link, you'll notice, because you get kicked out.
- There's finally a **Sign out** button, at the top right of every admin page. It ends the session on the server too, so a copied cookie stops working.

Agent tokens aren't touched by any of this. They don't depend on your session and keep working until you regenerate or revoke them.

## A bug that only a real test could find

"Works once" has to hold even when two requests arrive at the same moment. logdrop keeps everything in Vercel Blob, with no database, so the link is consumed with a conditional write: only the request that sees the link still unused can mark it as used. Unit tests passed. Then I fired ten parallel requests with the same link at a preview deployment, and **two of them got in**.

The cause: Vercel Blob's ETag (the version identifier the conditional write checks) is the MD5 of the content. The link record and its "used" marker had the same content, so the version never changed and every racing request passed the check. A unique "used" marker fixed it: ten parallel requests, exactly one sign-in, every time. The test suite now models ETags the way Vercel computes them, so this can't come back unnoticed.

## Deploy your own, with one click

The [logdrop README](https://github.com/Marvellous-Codeworks/logdrop) now has a **Deploy with Vercel** button. It forks the repository, creates the Vercel project and its Blob store, and asks for every environment variable in one form. The optional Edge Config store and your domain are still manual steps; the [self-hosting guide](/docs/logdrop/self-hosting) walks through what to prepare before clicking.

## Upgrading

If you run your own instance:

- **Every admin signs in once more after you deploy**: sessions from earlier versions are no longer accepted.
- No new environment variables.
- To sign in on Preview deployments, set `SITE_URL` in the Preview environment to the preview's address, since login links are built from it.

The details are in the [release notes](https://github.com/Marvellous-Codeworks/logdrop/releases/tag/v1.4.0) and in the updated [Admin sign-in](/docs/logdrop/admin-login) page. As always, [issues and pull requests](https://github.com/Marvellous-Codeworks/logdrop) are welcome.

*Giovanni*
