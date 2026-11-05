---
sidebar_position: 1
title: "Overview"
description: What OAuth Proxy for Google is, why it exists, what passes through it and its security model.
tags:
  - tms-oauth-proxy
  - OAuth
  - Cloudflare Workers
---

# Overview

OAuth Proxy for Google ([`tms-oauth-proxy`](https://github.com/Marvellous-Codeworks/tms-oauth-proxy) on GitHub) is a tiny Cloudflare Worker that brokers Google OAuth token exchanges. It lets a browser extension use an `authorization_code` + PKCE flow, with a long-lived refresh token, without shipping its OAuth client secret inside the extension package.

It was built for the [Google Drive backup](/docs/TMS/pages/backup-sync#connecting-on-brave-or-vivaldi) of The Marvellous Suspender on Brave and Vivaldi, but the code is generic: nothing in it is TMS-specific beyond its configuration.

:::info[Official instance]
Marvellous Codeworks runs an instance for TMS, and TMS users have nothing to set up. It isn't a shared service for other extensions: it only holds the TMS client secret and only accepts the TMS extension's origin. For your own extension, [deploy your own instance](./self-hosting.md).
:::

---

## Why it exists

Google's OAuth client types split into two groups. "Web application" clients are expected to keep their secret confidential, held server-side. Installed-app types ("Chrome app", "Desktop app", mobile) are exempt, because an installed app can't keep a secret.

An extension doing `authorization_code` + PKCE doesn't fit the exemption. A "Chrome app" client only works with `chrome.identity.getAuthToken()`, and a "Desktop app" client rejects the `https://<ext-id>.chromiumapp.org/` redirect URI that `chrome.identity.launchWebAuthFlow()` requires. That leaves a "Web application" client, whose secret must not ship in a public package.

The Worker solves this at the root: the secret lives in a Cloudflare secret, and the extension talks to the Worker instead of Google's token endpoint.

---

## How it works

1. **The extension obtains an authorization code** through `chrome.identity.launchWebAuthFlow()`, with a PKCE challenge.
2. **It posts the code to the Worker**, on `POST /token`, without any client secret.
3. **The Worker adds `client_id` and `client_secret`** and forwards the request to `https://oauth2.googleapis.com/token`.
4. **The Worker returns Google's response unchanged**, status code included.
5. **Renewals follow the same path**, with the `refresh_token` grant instead of the code.

Everything else, such as calls to the Drive API, goes straight from the extension to Google.

---

## What passes through the Worker

Read this part carefully if you are evaluating the trust involved: the Worker is a pass-through, so it does handle credentials while an exchange is in flight.

| Data | Passes through the Worker? |
|---|---|
| Authorization code | Yes, in the request |
| Refresh token | Yes, in the renewal request, and in the response to the first exchange |
| Access token | Yes, in the response |
| OAuth client secret | Added by the Worker, never sent to the extension |
| Google Drive files and backups | No |
| Your Google password | No |

The Worker has no storage attached and its code doesn't log request or response bodies, so these values exist only in memory for the duration of the request. Workers Logs and traces are turned off in `wrangler.toml`. Cloudflare can still process request metadata to run its network, such as timestamps, status codes and IP or location, but not the payload.

---

## Security model

The `Origin` check (`ALLOWED_ORIGIN`) is a basic CORS-style filter, **not an access control boundary**. A browser won't let JavaScript override that header, but any non-browser client can set it to whatever it wants.

The actual security boundary is Google. Without a genuine, unexpired code or refresh token issued for that OAuth client, every forwarded request is rejected by Google, whoever sent it. The Worker's only job is to keep the client secret off users' machines; it was never meant to gate who can attempt a token exchange.

---

## API

```
POST https://<your-worker>.workers.dev/token
Content-Type: application/json
Origin: chrome-extension://<your-extension-id>
```

The body is one of:

```json
{ "grant_type": "authorization_code", "code": "...", "redirect_uri": "...", "code_verifier": "..." }
```

```json
{ "grant_type": "refresh_token", "refresh_token": "..." }
```

`code_verifier` is forwarded when present. On success, or when Google refuses the exchange, the response is exactly what Google returned. The Worker answers on its own only in these cases:

| Status | When |
|---|---|
| 403 | `Origin` differs from `ALLOWED_ORIGIN`, on any request |
| 404 | The path isn't `/token` |
| 405 | The method isn't `POST` or `OPTIONS` |
| 400 `invalid_request` | Malformed JSON, or a missing `code`, `redirect_uri` or `refresh_token` |
| 400 `unsupported_grant_type` | `grant_type` is neither of the two above |

---

## Stack

A single JavaScript module (`worker/index.js`) with no runtime dependencies, deployed on Cloudflare Workers.

## License

OAuth Proxy for Google is released under the [AGPL-3.0](https://github.com/Marvellous-Codeworks/tms-oauth-proxy/blob/main/LICENSE). Issues and pull requests are welcome on [GitHub](https://github.com/Marvellous-Codeworks/tms-oauth-proxy).
