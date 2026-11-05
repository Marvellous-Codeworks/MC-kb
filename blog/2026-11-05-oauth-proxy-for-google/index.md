---
slug: oauth-proxy-for-google
title: "OAuth Proxy for Google: the piece behind Drive backups on Brave and Vivaldi is now a project"
description: "OAuth Proxy for Google, the small Cloudflare Worker that keeps Drive backups connected on Brave and Vivaldi, is now a Marvellous Codeworks project: AGPL-3.0, version 1.0.0, with its own documentation and page."
date: 2026-11-05T22:00:00+01:00
authors: [gioxx]
tags: [announcement, tms, tms-oauth-proxy]
---

The small Cloudflare Worker that keeps [TMS Drive backups connected on Brave and Vivaldi](/blog/tms903-drive-pkce-refresh-token) now has a name, a license and a home of its own. It's called **OAuth Proxy for Google**, it's at version 1.0.0, and you can use it for your own browser extension.

:::tip[TL;DR]
- **Nothing changes for TMS users**: there's nothing to install or configure.
- **What it is**: a Cloudflare Worker that adds an OAuth client secret to Google token exchanges, so that secret never ships inside an extension.
- **Open source**: [AGPL-3.0 on GitHub](https://github.com/Marvellous-Codeworks/tms-oauth-proxy), with a [1.0.0 release](https://github.com/Marvellous-Codeworks/tms-oauth-proxy/releases/tag/v1.0.0).
- **Docs**: [overview](/docs/tms-oauth-proxy/overview), [self-hosting](/docs/tms-oauth-proxy/self-hosting) and [FAQ](/docs/tms-oauth-proxy/faq).
:::

{/* truncate */}

## Why it exists

Chrome's `chrome.identity.getAuthToken()` doesn't work on browsers such as Brave and Vivaldi, so TMS has to use an `authorization_code` + PKCE flow there. The OAuth client type that flow needs is expected to keep its secret confidential, and a public extension package can't keep anything confidential.

The Worker solves that at the root. The secret lives in a Cloudflare secret, the extension talks to the Worker, and the Worker adds the secret and forwards the request to Google. The full reasoning is in the [overview](/docs/tms-oauth-proxy/overview#why-it-exists).

## What it means for your data

If you use TMS on Chrome with the standard sign-in, or you don't use Drive backups, TMS never contacts the Worker.

On Brave and Vivaldi, with Drive connected, the authorization code and the tokens do pass through it while an exchange is in flight. The Worker has no storage attached and its code doesn't log request or response bodies. Your Drive files and backups never pass through it, and neither does your Google password. We've detailed [what passes through the Worker](/docs/tms-oauth-proxy/overview#what-passes-through-the-worker), and updated the [TMS privacy policy](https://www.marvellouscode.works/tms/privacy) to match.

## Use it for your own extension

Our instance only holds the TMS client secret and only accepts the TMS extension's origin, so it isn't a shared service. Nothing in the code is TMS-specific beyond its configuration, though: if your extension has the same problem, [deploy your own](/docs/tms-oauth-proxy/self-hosting).

You'll find the project on [its page](https://www.marvellouscode.works/tms-oauth-proxy) and on [GitHub](https://github.com/Marvellous-Codeworks/tms-oauth-proxy), where issues and pull requests are welcome.
