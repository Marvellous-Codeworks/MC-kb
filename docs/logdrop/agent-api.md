---
sidebar_position: 6
title: "Agent API"
description: Let your own AI agent or automation read logdrop uploads with a personal Bearer token - tokens, endpoint, response format, redacted fields and read tracking.
tags:
  - logdrop
  - API
  - AI agent
---

# Agent API

logdrop exposes a read-only endpoint so an **AI agent** (or any other operator-side automation) can fetch an upload given the plain link a user shared, without an admin login session. Typical use: a user posts a logdrop link in a GitHub issue, and your agent reads the log to help triage it.

Every admin authenticates their agent with a **personal agent token**, generated from the [admin dashboard](./admin-dashboard#ai-agent-access). No environment variable or redeploy is needed.

:::warning[Keep the token private]
An agent token grants read access to **every** upload on the instance. Store it only in your own agent/automation configuration. Never share it with uploaders, never put it in a link, never commit it to a repository. If it leaks, regenerate or revoke it from the dashboard.
:::

---

## Personal agent tokens

Available from logdrop **1.3.0**. In the dashboard, under **Signed in as**, open **AI agent access → Manage your token**:

- **Generate token** creates your token and shows it **once**, in a dialog with a copy button. Copy it into your agent's configuration before closing the dialog: logdrop can't show it again.
- **Regenerate** replaces it with a new one. The old token stops working immediately.
- **Revoke** deletes it. Agents using it get `401` from then on.

Afterwards, the dashboard shows only a masked form (`ld_agent_…a1b2`), with when it was created and last used.

How tokens behave:

- **One token per admin**, belonging to whoever generated it. Each admin manages only their own.
- **Stored only as a hash** (SHA-256) in the instance's Blob store. Neither the operator nor a leak of the store can recover a usable token.
- **Tied to the allow-list.** A token stops working as soon as its owner is removed from `ADMIN_EMAILS`, without any other step.
- **Reads are attributed** to the token's owner in the [log view](./log-view#activity).

Tokens start with `ld_agent_`, followed by 43 random characters.

### Legacy instance-wide token (`AGENT_API_TOKEN`)

Before 1.3.0, agent access used a single secret shared by every admin, set as the `AGENT_API_TOKEN` environment variable. It **still works**, but it's **deprecated**:

- reads made with it are attributed to *the instance token* instead of an admin;
- revoking it means changing the variable for everyone and redeploying;
- removing an admin from `ADMIN_EMAILS` doesn't stop an agent holding it.

When it's set, the dashboard flags it as deprecated. To migrate: have each admin generate a personal token, switch your agents to it, then delete `AGENT_API_TOKEN` from every Vercel environment and redeploy. See [Self-hosting](./self-hosting#environment-variables).

---

## Request

```http
GET /api/agent/paste/<slug>
Authorization: Bearer <your agent token>
```

The `<slug>` is the last part of the share link: for `https://logdrop.example/r/Qm3vT8kLx2RpZ9aW4nYc1g` it's `Qm3vT8kLx2RpZ9aW4nYc1g`.

```bash
curl -H "Authorization: Bearer $LOGDROP_AGENT_TOKEN" \
  https://logdrop.example/api/agent/paste/Qm3vT8kLx2RpZ9aW4nYc1g
```

## Response

`200 OK` with a JSON body:

```json
{
  "slug": "Qm3vT8kLx2RpZ9aW4nYc1g",
  "content": "TMS diagnostic report\nVersion: 8.4.2 ...",
  "meta": {
    "slug": "Qm3vT8kLx2RpZ9aW4nYc1g",
    "createdAt": "2026-09-29T08:50:00.000Z",
    "expiresAt": "2026-10-06T08:50:00.000Z",
    "sizeBytes": 674,
    "originalFilename": null,
    "label": "TMS debug report, tab groups lose color",
    "issueUrl": "https://github.com/gioxx/MarvellousSuspender/issues/412",
    "analyzed": true,
    "analyzedAt": "2026-09-29T14:50:00.000Z",
    "agentAccessCount": 3,
    "agentLastAccessAt": "2026-09-30T10:15:00.000Z"
  }
}
```

| Field | Meaning |
|---|---|
| `content` | The uploaded text, unchanged. |
| `meta.createdAt` / `meta.expiresAt` | ISO 8601 timestamps (UTC). |
| `meta.sizeBytes` | Size of the text in bytes. |
| `meta.originalFilename` | Name of the `.txt` file, if the uploader picked one instead of pasting; otherwise `null`. |
| `meta.label` / `meta.issueUrl` | Optional label and GitHub issue link given at upload time, or `null`. |
| `meta.analyzed` / `meta.analyzedAt` | Whether a maintainer marked it as analyzed, and when (`null` if not). |
| `meta.agentAccessCount` / `meta.agentLastAccessAt` | Agent reads so far, **including this one**, and the time of the latest. |

### Redacted fields

These fields are stored but **never** returned to an agent:

- `uploaderIp`, `uploaderCountry`, `userAgent`: data about the uploader.
- `analyzedBy`: the email of the maintainer who marked it as analyzed.
- `agentLastAccessBy`: whose token performed the latest agent read.

## Errors

| Status | Body | Meaning |
|---|---|---|
| `401` | `Unauthorized` | Missing or wrong `Authorization` header, a regenerated or revoked token, or a token whose owner is no longer in `ADMIN_EMAILS`. |
| `404` | `Not found` | No upload with that slug, or it has already expired (even if the daily cleanup hasn't deleted it yet). |

---

## Read tracking

Every successful read (`200`) is recorded on the upload: the read count goes up by one, the last-access time is updated and the read is attributed to the token's owner. The token's own *last used* time, shown in the dashboard, is updated too. Maintainers see this as:

- a **robot badge** next to the slug in the [dashboard](./admin-dashboard#badges);
- **Read by AI agent N time(s) · last `<date>` by `<admin>`** in the [log view](./log-view#activity).

Failed requests (`401`, `404`) are not recorded. Recording is best-effort: if the metadata write fails, the agent still gets its response, and two reads landing at the very same moment may be counted as one.

## Testing against a protected Preview deployment

If **Vercel Deployment Protection** is on for Preview deployments, Vercel answers every request, Agent API included, with a redirect to its SSO page before it reaches logdrop. To test an agent there, create a **Protection Bypass for Automation** secret (Project → Settings → Deployment Protection) and send it as an extra header:

```bash
curl -H "Authorization: Bearer $LOGDROP_AGENT_TOKEN" \
  -H "x-vercel-protection-bypass: $VERCEL_BYPASS_SECRET" \
  https://<preview-deployment>.vercel.app/api/agent/paste/<slug>
```

Revoke the bypass secret when you're done.
