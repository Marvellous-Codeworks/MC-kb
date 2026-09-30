---
sidebar_position: 1
title: "Overview"
description: What logdrop is, how its privacy model works, and the lifecycle of an upload.
tags:
  - logdrop
  - privacy
---

# Overview

[logdrop](https://github.com/Marvellous-Codeworks/logdrop) is a small, self-hostable, [PrivateBin](https://github.com/PrivateBin/PrivateBin)-style drop-off for plain text: diagnostic reports, logs, configs, snippets. Anyone can upload, no account needed. Only an allow-listed set of maintainers can ever read an upload back, and every upload deletes itself after a retention window.

It was built so that [TMS](../TMS/pages/diagnostic-page) users could share a captureLogs report (which can contain tab titles and URLs) without pasting it into a public GitHub issue, but nothing in it is TMS-specific.

:::info[Official instance]
Marvellous Codeworks runs an instance at **[logdrop.marvellouscode.works](https://logdrop.marvellouscode.works)**, kept available for TMS users. It isn't a shared public service for unrelated projects: if you want the same flow for your own project, [deploy your own instance](./self-hosting).
:::

---

## How it works

1. **Someone uploads text.** They paste it (or pick a `.txt` file) on the home page, optionally add a label and a GitHub issue link, pass a Cloudflare Turnstile check and click **Upload**. See [Uploading a log](./uploading).
2. **They get a link** like `https://logdrop.example/r/<slug>` and share it wherever they need to, for example in a GitHub issue.
3. **Only a maintainer can open it.** Opening the link without an admin session redirects to the [sign-in page](./admin-login). Maintainers sign in with a magic link sent to an allow-listed email address.
4. **Maintainers triage it** from the [admin dashboard](./admin-dashboard) and the [log view](./log-view): read, copy, download, mark as analyzed, delete.
5. **It expires on its own.** A daily cleanup job deletes every upload older than the retention window (7 days by default).

Optionally, an AI agent run by the maintainer can read uploads through the [Agent API](./agent-api), using a secret token instead of an admin session.

---

## Privacy model

| Who | Can upload | Can read uploads |
|---|---|---|
| Anyone | Yes, no account, after a Turnstile check | No |
| Allow-listed maintainers (`ADMIN_EMAILS`) | Yes | Yes, after signing in via magic link |
| An AI agent holding `AGENT_API_TOKEN` (optional) | No | Yes, content and non-sensitive metadata only |

A few details worth knowing:

- **The link isn't the key.** The slug in the link is 128 bits of randomness, but reading always requires a signed-in maintainer. A link leaked in a public issue is useless to anyone else.
- **Stored metadata.** Alongside the text, logdrop stores the creation and expiry time, size, optional label and issue link, and, for abuse handling, the uploader's IP address, country (from Vercel's edge headers) and user agent. Admins see the country in the dashboard; IP and user agent are never shown in the UI and are never returned to an AI agent.
- **Plain text only.** Binary files and text with control characters are rejected.
- **Nothing is public at the storage level.** Blobs are written with a random suffix, so their storage URL can't be derived from the slug; every read goes through the authenticated app.

---

## Limits and defaults

| Setting | Default | Configurable via |
|---|---|---|
| Retention window | 7 days | `RETENTION_DAYS` |
| Max upload size | 4 MB | `MAX_UPLOAD_BYTES` (keep it under Vercel's ~4.5 MB request limit) |
| Label length | 200 characters (longer labels are truncated) | - |
| Magic link validity | 15 minutes | - |
| Admin session | 7 days | - |
| Cleanup job | daily, 03:00 UTC | `vercel.json` |

---

## Stack

TanStack Start and TanStack Router on React 19, built with Vite and Bun, deployed on Vercel. Storage is Vercel Blob (no database), magic-link emails go through Resend, uploads are protected by Cloudflare Turnstile, a Vercel Edge Config key acts as a runtime upload kill-switch, and Vercel Cron runs the daily cleanup.

## License

logdrop is released under the [AGPL-3.0](https://github.com/Marvellous-Codeworks/logdrop/blob/main/LICENSE). Issues and pull requests are welcome on [GitHub](https://github.com/Marvellous-Codeworks/logdrop).
