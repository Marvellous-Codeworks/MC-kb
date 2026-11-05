---
sidebar_position: 2
title: "Self-hosting"
description: Deploy your own tms-oauth-proxy for your browser extension on Cloudflare Workers - OAuth client, configuration, secret and extension changes.
tags:
  - tms-oauth-proxy
  - self-hosting
  - Cloudflare Workers
---

# Self-hosting

Use this guide if your own extension has the same problem: it needs `authorization_code` + PKCE with `chrome.identity.launchWebAuthFlow()`, and a client secret it can't ship.

## 1. Fork and configure

1. Fork [the repository](https://github.com/Marvellous-Codeworks/tms-oauth-proxy).
2. Register your own Google OAuth client, of type "Web application", and note its client ID and secret.
3. Edit `wrangler.toml`, setting `GOOGLE_CLIENT_ID` and `ALLOWED_ORIGIN` as described below.

| Name | Where it's set | Committed? | Purpose |
|---|---|---|---|
| `GOOGLE_CLIENT_ID` | `wrangler.toml`, `[vars]` | Yes, it's a public value | The OAuth client used for the exchange |
| `ALLOWED_ORIGIN` | `wrangler.toml`, `[vars]` | Yes, it's a public value | `chrome-extension://<your-extension-id>`, a soft filter (see the [security model](./overview.md#security-model)) |
| `GOOGLE_CLIENT_SECRET` | Cloudflare secret | **Never** | The OAuth client secret. It can be replaced, but not read back once set |

## 2. Deploy

Connect your fork from the Cloudflare dashboard (Workers & Pages, then Create, then Connect to Git). It builds and deploys on every push to `main`. The free `workers.dev` subdomain is enough, no custom domain is required.

## 3. Set the secret

Add `GOOGLE_CLIENT_SECRET` as an encrypted variable from the dashboard (Settings, then Variables and Secrets), or from the CLI:

```bash
npm install
wrangler login
wrangler secret put GOOGLE_CLIENT_SECRET
```

## 4. Point your extension at the Worker

1. Send token requests to `https://<your-worker>.workers.dev/token` instead of `https://oauth2.googleapis.com/token`, as described in the [API section](./overview.md#api).
2. Remove `client_secret` from what the extension sends. `client_id` can go too, since the Worker already has it.
3. Add the Worker's domain to `connect-src` in the `content_security_policy` of your `manifest.json`.

`exchangeTokenEndpoint()` in TMS's [`gsBackup.js`](https://github.com/gioxx/MarvellousSuspender/blob/master/src/js/gsBackup.js) is a reference implementation.

## Local development

Copy `.dev.vars.example` to `.dev.vars`, fill in a test secret, then run:

```bash
npm run dev
```

## Rotating the secret

If the client secret is rotated in Google Cloud Console, update it with `wrangler secret put GOOGLE_CLIENT_SECRET` and redeploy. No extension release is needed, since the secret never ships in the package.

If `GOOGLE_CLIENT_ID` or `ALLOWED_ORIGIN` change, for example after publishing the extension under a different key, update `wrangler.toml`. They are picked up on the next deploy.

## Your own obligations

The project is under the [AGPL-3.0](https://github.com/Marvellous-Codeworks/tms-oauth-proxy/blob/main/LICENSE), so if you run a modified version for others, the license requires you to offer them its source.
