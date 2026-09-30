---
sidebar_position: 8
title: "FAQ"
description: Frequently Asked Questions about logdrop.
tags:
  - FAQ
  - logdrop
---

# Frequently Asked Questions

## For uploaders

### Who can read what I upload?

Only the maintainers of the instance you uploaded to, whose emails are on its allow-list. If the operator enabled the [Agent API](./agent-api), their own AI agent can read it too, but without your IP address, country or browser details. Nobody else, even with the link.

### Is it safe to post the link in a public GitHub issue?

Yes, that's what it's for. The link opens only for signed-in maintainers; anyone else lands on a sign-in page.

### Can I delete or edit my upload?

No, uploads can't be edited, and only maintainers can delete them. If you uploaded something by mistake, ask them to delete it. Otherwise it disappears on its own when the retention window ends (7 days by default).

### Do I need an account?

No. Uploading needs no account, only a Cloudflare Turnstile check, which is usually automatic.

### Why was my file rejected?

logdrop accepts plain text only, up to 4 MB by default. Binary files (zip, PDF, images) and text with control characters are rejected. See [Uploading a log](./uploading#troubleshooting) for each error message.

### Is my upload encrypted like on PrivateBin?

No. PrivateBin encrypts in the browser and keeps the key in the link; logdrop instead relies on access control, where only authenticated maintainers can read. That's what lets a maintainer open an upload from a plain link, and lets the link be posted publicly without exposing anything.

---

## For maintainers

### How do I get admin access?

The instance operator adds your email to `ADMIN_EMAILS`. Then [sign in](./admin-login) with a magic link, no password.

### What does the robot icon mean?

An AI agent read that upload through the [Agent API](./agent-api) at least once. The [log view](./log-view#activity) shows how many times and when last.

### I set `AGENT_API_TOKEN` but the dashboard doesn't show "AI agent access enabled."

The variable isn't reaching that deployment. On Vercel, check it's enabled for the right environment (Production and/or Preview) and redeploy. See [Self-hosting](./self-hosting#environment-variables).

### An expired upload is still in the dashboard, why?

Cleanup runs once a day at 03:00 UTC, so an upload can stay listed for up to a day after its expiry time. The Agent API already refuses it.

### Can I undo a delete?

No. Deleting removes the content and its metadata from storage immediately.

### Can I use the Marvellous Codeworks instance for my own project?

The instance at [logdrop.marvellouscode.works](https://logdrop.marvellouscode.works) is kept for TMS users. For your own project, [deploy your own instance](./self-hosting), logdrop is open source.

### How do I report a bug or suggest a feature?

Open an issue on [GitHub](https://github.com/Marvellous-Codeworks/logdrop/issues). Pull requests are welcome too.
