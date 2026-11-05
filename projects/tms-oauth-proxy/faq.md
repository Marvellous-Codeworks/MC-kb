---
sidebar_position: 3
title: "FAQ"
description: Frequently Asked Questions about OAuth Proxy.
tags:
  - FAQ
  - tms-oauth-proxy
---

# Frequently Asked Questions

### Do I need to install or configure anything to use TMS?

No. OAuth Proxy is a server-side component that TMS uses on its own when needed, and there's nothing to set up.

### Does TMS always use it?

No. It's only involved when TMS can't use `chrome.identity.getAuthToken()`, as on [Brave and Vivaldi](/docs/TMS/pages/backup-sync#connecting-on-brave-or-vivaldi), and only if you connect Google Drive. With standard Chrome sign-in, or without Drive backups, TMS never contacts it.

### Can the Worker see my Google Drive files?

No. Backups travel directly between your browser and Google. The Worker only handles the token exchange, but that does mean tokens pass through it, see [what passes through the Worker](./overview.md#what-passes-through-the-worker).

### Are my tokens stored on the server?

No. The Worker has no storage attached and doesn't log request or response bodies. TMS keeps the refresh token in the browser's local extension storage.

### What happens to Drive backups if the Worker is unreachable?

Once the current access token expires, renewing it fails, so backups to Drive fail until the Worker is back. Your refresh token is kept: TMS only discards it when Google answers `invalid_grant`.

### Can I use the official instance for my own extension?

No. It holds the TMS client secret and only accepts the TMS extension's origin. [Deploy your own](./self-hosting.md) instead.

### Isn't the Origin check easy to bypass?

Yes, and that's fine. It isn't the security boundary, Google is. See the [security model](./overview.md#security-model).
