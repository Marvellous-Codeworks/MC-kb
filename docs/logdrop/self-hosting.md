---
sidebar_position: 7
title: "Self-hosting"
description: Deploy your own logdrop instance on Vercel - one-click button, storage, Turnstile, secrets, environment variables, domain, kill-switch and cleanup job.
tags:
  - logdrop
  - self-hosting
  - Vercel
---

# Self-hosting

logdrop is designed to be deployed by anyone who wants the same *"reporters upload freely, only you can read it, it expires on its own"* flow for their own project. It runs on **Vercel**, with no database.

## What you need

- A [Vercel](https://vercel.com) account (the Hobby plan is enough to start).
- A [Resend](https://resend.com) account, to send magic-link emails, with a verified sender domain.
- A [Cloudflare](https://dash.cloudflare.com) account, for the Turnstile widget.
- A (sub)domain you control, e.g. `logdrop.your-domain.example`.
- A fork or clone of [Marvellous-Codeworks/logdrop](https://github.com/Marvellous-Codeworks/logdrop).

---

## Deploy with one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMarvellous-Codeworks%2Flogdrop&project-name=logdrop&repository-name=logdrop&env=TOKEN_SECRET%2CADMIN_EMAILS%2CRESEND_API_KEY%2CMAIL_FROM%2CSITE_URL%2CVITE_TURNSTILE_SITE_KEY%2CTURNSTILE_SECRET_KEY%2CCRON_SECRET%2CRETENTION_DAYS%2CMAX_UPLOAD_BYTES&envDefaults=%7B%22RETENTION_DAYS%22%3A%227%22%2C%22MAX_UPLOAD_BYTES%22%3A%224194304%22%7D&envDescription=Admin%20allow-list%2C%20Resend%20mail%2C%20Cloudflare%20Turnstile%20keys%20and%20two%20secrets%20you%20generate%20yourself.%20See%20the%20README%20for%20each%20value.&envLink=https%3A%2F%2Fgithub.com%2FMarvellous-Codeworks%2Flogdrop%236-set-every-environment-variable&stores=%5B%7B%22type%22%3A%22blob%22%2C%22access%22%3A%22public%22%7D%5D)

The button runs the Vercel import for you:

- forks the repository into your Git account and creates the Vercel project;
- creates and connects a **public** Blob store (`BLOB_READ_WRITE_TOKEN`), so you can skip [step 2](#2-create-and-connect-a-vercel-blob-store);
- asks for every [environment variable](#environment-variables) in one form, with `RETENTION_DAYS` and `MAX_UPLOAD_BYTES` pre-filled.

Prepare these before you click, because the form asks for them: the Turnstile keys ([step 4](#4-create-a-cloudflare-turnstile-widget)), your Resend API key and sender, `TOKEN_SECRET` and `CRON_SECRET` ([step 5](#5-generate-the-app-secrets)), and `SITE_URL`. No domain yet? Use the `*.vercel.app` address of the project and change it later.

The button can't do everything. Still manual:

- the optional Edge Config store for the [upload kill-switch](#upload-kill-switch) ([step 3](#3-create-and-connect-an-edge-config-store));
- your domain, on Vercel and on the Turnstile widget ([step 7](#7-point-your-domain-at-the-deployment)).

After changing a variable or connecting a store, redeploy: changes only apply to new deployments.

---

## Deploy step by step

### 1. Create the Vercel project
Import the repository as a new Vercel project (or `vercel link` an existing one). **Don't deploy yet**: the app needs storage and environment variables first, or the first real upload will fail.

### 2. Create and connect a Vercel Blob store
Project → **Storage** → **Create Database** → **Blob**.

- Choose **Public** access. logdrop writes blobs with `access: "public"` and reads them with a plain `fetch()`; a *Private* store won't work. Blobs still aren't reachable in practice, because every blob name carries a random suffix that can't be derived from the slug.
- Use **Connect Project** to attach it to this project (creating the store alone doesn't connect it: check the store's *Connected Projects*).
- This provisions `BLOB_READ_WRITE_TOKEN` automatically.

### 3. Create and connect an Edge Config store
Same **Storage** tab → **Create Database** → **Edge Config** (shown as **Global Config** in newer dashboards, same product). Create it and **Connect Project**. This provisions `EDGE_CONFIG`. It powers the optional [upload kill-switch](#upload-kill-switch).

### 4. Create a Cloudflare Turnstile widget
Cloudflare dashboard → **Turnstile** → **Add widget**:

1. Domain: the subdomain you'll deploy to (add `localhost` too if you want to test locally).
2. Widget mode: **Managed**.
3. Copy the **Site Key** (→ `VITE_TURNSTILE_SITE_KEY`, public) and the **Secret Key** (→ `TURNSTILE_SECRET_KEY`, private).

### 5. Generate the app secrets
`TOKEN_SECRET` and `CRON_SECRET` are random strings you generate yourself, one per variable:

```bash
openssl rand -base64 32
```

### 6. Set the environment variables
Project → **Settings** → **Environment Variables**, see the [full list below](#environment-variables).

### 7. Point your domain at the deployment
Add a CNAME for your subdomain pointing to Vercel, and add the same domain under **Settings** → **Domains**. It must match `SITE_URL` exactly.

### 8. Deploy
Trigger a deploy, or a **redeploy** if one already ran before steps 2-6 were done: environment variables and storage bindings only apply to deployments created after they're set. Then open the site and upload something to test it.

:::tip[Upload fails right after deploying?]
A generic *"Upload failed"* almost always means a missing environment variable or storage connection. Check the Vercel function logs first.
:::

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `TOKEN_SECRET` | Yes | Signing secret for magic-link and session tokens (step 5). Changing it signs everyone out. |
| `ADMIN_EMAILS` | Yes | Comma-separated list of admin emails, case-insensitive. Removing an address revokes its access immediately. |
| `RESEND_API_KEY` | Yes | Resend API key for magic-link emails. |
| `MAIL_FROM` | Yes | Sender, e.g. `logdrop <noreply@your-domain.example>`, on a domain verified in Resend. |
| `SITE_URL` | Yes | Public base URL, no trailing slash, e.g. `https://logdrop.your-domain.example`. Used to build share links and magic links. |
| `RETENTION_DAYS` | No | Days before an upload is deleted. Default `7`. |
| `MAX_UPLOAD_BYTES` | No | Max upload size in bytes. Default `4194304` (4 MB). Keep it below Vercel's ~4.5 MB request limit, larger bodies are rejected by the platform before logdrop sees them. |
| `VITE_TURNSTILE_SITE_KEY` | Yes | Turnstile site key (public, shipped to the browser). |
| `TURNSTILE_SECRET_KEY` | Yes | Turnstile secret key (server-side only). |
| `CRON_SECRET` | Yes | Secret Vercel sends to the daily cleanup job. |
| `AGENT_API_TOKEN` | No | **Deprecated.** Legacy instance-wide token for the [Agent API](./agent-api.md). Not needed: since 1.3.0 each admin generates a personal token from the dashboard. Keep it only while existing agents still use it. |
| `BLOB_READ_WRITE_TOKEN` | Auto | Provisioned by connecting the Blob store (step 2). |
| `EDGE_CONFIG` | Auto | Provisioned by connecting the Edge Config store (step 3). |

:::warning[Enable variables for each Vercel environment]
Vercel scopes every variable to **Production**, **Preview** and/or **Development**. A variable enabled only for Production doesn't exist on Preview deployments: for example, `RESEND_API_KEY` set only for Production means Preview deployments can't send magic-link emails. Tick every environment you need, then redeploy.

Magic links are built from `SITE_URL`, so to sign in on a Preview deployment set `SITE_URL` in the **Preview** environment to that preview's address (for example the branch alias); otherwise the links it sends point at production.
:::

---

## Upload kill-switch

To stop new uploads without redeploying (e.g. during abuse), add a boolean key **`uploadsDisabled`** to the connected Edge Config store and set it to `true`. Uploaders then get *"Uploads are temporarily disabled"*; admins can still read, triage and delete existing uploads. Set it back to `false` (or delete the key) to reopen uploads.

If Edge Config can't be reached, uploads stay **enabled**: the switch is a safety valve, not a dependency.

## Cleanup job

`vercel.json` schedules `/api/cron/cleanup` every day at **03:00 UTC**. It deletes every upload whose expiry time has passed, authenticated by `CRON_SECRET`. Between an upload's expiry and the next run, it may still appear in the admin dashboard, but the Agent API already treats it as gone.

---

## Local development

```bash
bun install
cp .env.example .env.local   # fill in the values above
bun run dev
bun test
```

Add `localhost` to the Turnstile widget's domains to test uploads locally.

## Updating

Pull the latest changes from [upstream](https://github.com/Marvellous-Codeworks/logdrop) into your fork and let Vercel redeploy. Stored uploads don't need migrations: metadata fields added by newer versions are filled with defaults when older uploads are read. Check the [release notes](https://github.com/Marvellous-Codeworks/logdrop/releases) for new optional variables.
