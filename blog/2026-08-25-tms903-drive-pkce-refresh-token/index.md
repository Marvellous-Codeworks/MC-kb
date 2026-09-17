---
slug: tms903-drive-pkce-refresh-token
title: "9.0.3 in progress: a real fix for Drive backups disconnecting on Brave and Vivaldi"
description: "9.0.2's Brave/Vivaldi Drive fallback stopped the connect flow from hanging, but the underlying token it relied on was still short-lived and unreliable to renew. 9.0.3 replaces it with a proper refresh token."
date: 2026-08-25T10:15:00+01:00
authors: [gioxx]
tags: [tms, bug]
---

[9.0.2 shipped a fallback](/blog/tms-release-9-0-2#google-drive-connect-account-on-brave-and-vivaldi) for connecting Google Drive backup on Brave and Vivaldi, browsers where Chrome's own `chrome.identity.getAuthToken()` doesn't work. That fallback fixed the immediate problem: the connect button no longer hung indefinitely. It did not fully fix the underlying issue, and reports kept coming in of Drive accounts flipping back to "disconnected" after just one or two automatic backups. 9.0.3 replaces the fallback's mechanism entirely.

:::tip[TL;DR]
- **Only affects Drive backup on Brave and Vivaldi.** Chrome users aren't affected at all.
- The 9.0.2 fallback used a token that expired every hour and needed the browser's help to silently renew it, Brave and Vivaldi don't support that renewal reliably, so accounts kept disconnecting on their own.
- 9.0.3 replaces it with a long-lived token that renews itself directly, no browser dependency, no more surprise disconnects.
- The token exchange goes through a small Cloudflare Worker we run ([`tms-oauth-proxy`](https://github.com/Marvellous-Codeworks/tms-oauth-proxy)), so the OAuth client secret no longer ships inside the extension package.
- **If you already connected Drive on Brave/Vivaldi**, you'll need to click **Connect** once more in Options → Backup after updating; after that, it just works.
:::

{/* truncate */}

## Why the 9.0.2 fallback still disconnected

The fallback used `chrome.identity.launchWebAuthFlow()`, which on the first connection opens a real tab for you to sign in and grant access. What it returns is an **implicit-flow access token**, short-lived, about an hour, by design. Renewing it silently before it expires means calling `launchWebAuthFlow()` again with `prompt: 'none'`, no visible tab, no interaction, just a background request that depends entirely on the browser already holding an active Google session for that tab.

That dependency is exactly where it broke. Brave and Vivaldi don't maintain that ambient session reliably the way Chrome does, so the silent renewal call would fail once the hour was up, and the account looked disconnected from TMS's side even though nothing the user did caused it.

The root cause sits upstream, in Brave's own `chrome.identity` implementation, not in TMS. It's tracked in [brave-browser#38066](https://github.com/brave/brave-browser/issues/38066#issuecomment-5395066080), still open as of this writing, no movement from Brave's side yet. We're not waiting on it: 9.0.3 works around it entirely on our end instead.

## What 9.0.3 does instead

The fix is a proper move to **authorization-code flow with PKCE**. The practical difference: instead of a token that expires every hour and needs the browser's help to silently renew, one interactive consent (the same tab you already see the first time you connect) mints a long-lived **refresh token**, stored locally. Every renewal after that is a direct request to Google's token endpoint, no tab, no cookies, no dependency on whatever session state the browser happens to be holding onto at that moment.

This reuses the existing "Web application" OAuth client already registered for TMS (the same one used for [the 9.0.2 fallback](/blog/tms-release-9-0-2#google-drive-connect-account-on-brave-and-vivaldi)) rather than a new one. We looked at switching to a "Desktop app" client type instead, which Google documents as the more natural fit for an installed application, but tested it directly against the live authorization endpoint and confirmed it rejects the redirect URL format Chrome extensions are required to use. The existing client stays.

## If you already connected Drive on Brave or Vivaldi

There is one unavoidable step for anyone who connected Drive through the 9.0.2 fallback already: no previous release could have stored a refresh token for you, because the mechanism didn't exist yet. Once your current short-lived session expires, roughly an hour after updating to 9.0.3, the next automatic backup attempt will fail once, and TMS will show the same "Drive disconnected" indicator it already shows for any auth problem.

The fix is a single click on **Connect** in Options → Backup, same as reconnecting for any other reason. After that one-time reconnect, you get the new, reliable renewal path with no further action needed, indefinitely, no more surprise disconnects after a couple of backups.

## The client secret: what we got wrong, and the fix

An earlier draft of this post described shipping the OAuth client secret inside the extension package as a "known, accepted limitation", on the reasoning that a leak only lets a third party impersonate the app for a phishing consent screen, not touch any user's actual Drive data. That framing undersold the real risk.

The OAuth client TMS uses for this flow is registered as a "Web application" type, which by Google's own policy is expected to keep its client secret confidential, held server-side, never exposed. TMS has no server, so the secret was compiled straight into the extension package, and since a Chrome extension's `.crx`/`.zip` is trivially unpacked by anyone, it was effectively public the moment it shipped. The part we underweighted: this isn't just a phishing-blast-radius question, it's a policy compliance problem. Google can flag or suspend an OAuth client that doesn't meet its confidentiality expectations for its registered type, and that would break Drive backup for *every* TMS user at once, not just enable a narrow impersonation scenario.

We looked again at the client types Google exempts from this requirement, ones built for installed applications, like Chrome extensions, Desktop apps, iOS, and Android. Neither fits here: a "Chrome app" client only works with `chrome.identity.getAuthToken()`, the exact API that doesn't work on Brave and Vivaldi and is the whole reason this fallback exists, and a "Desktop app" client rejects the redirect URL format this flow has to use, confirmed directly against the live endpoint. So instead of swapping client types, we removed the need for the secret to be embedded at all.

**[`tms-oauth-proxy`](https://github.com/Marvellous-Codeworks/tms-oauth-proxy)** is a small Cloudflare Worker, free tier (at least for now), that holds the client secret server-side and does nothing but forward the token exchange to Google: the initial authorization-code grant, and every refresh_token renewal after that. TMS's own code never has the secret at all anymore, `gsBackup.js` calls the worker instead of Google's token endpoint directly. The worker sees only the exchange request itself (a code or a refresh token, nothing else) and never touches your Drive data, your access token, or anything else, those stay entirely in your own browser's storage as before. As part of shipping this, the previously-exposed secret was rotated in Google Cloud Console, so the earlier one is dead regardless.

This closes the gap the original "known, accepted limitation" note left open, cleanly, for zero added cost, rather than leaving it as a documented tradeoff.

## Where this leaves things

If you're on Chrome, none of this affects you, `chrome.identity.getAuthToken()` already works there and this fallback never activates. If you're on Brave or Vivaldi and use Drive backup, this closes the gap that made 9.0.2's fix incomplete: one connection, one long-lived token, no more silent disconnects a couple of backups in.

:::info
Both pieces of this work are merged ([pull request #440](https://github.com/gioxx/MarvellousSuspender/pull/440) for the PKCE fallback, [pull request #476](https://github.com/gioxx/MarvellousSuspender/pull/476) for the `tms-oauth-proxy` move) and included in **TMS 9.0.3**, submitted for Chrome Web Store review. See the [9.0.3 release post](/blog/tms-release-9-0-3) for the full picture and current status.
:::
