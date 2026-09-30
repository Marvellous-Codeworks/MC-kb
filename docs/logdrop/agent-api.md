---
sidebar_position: 6
title: "Agent API"
description: Let your own AI agent or automation read logdrop uploads with a Bearer token - endpoint, response format, redacted fields and read tracking.
tags:
  - logdrop
  - API
  - AI agent
---

# Agent API

logdrop can optionally expose a read-only endpoint so an **AI agent** (or any other operator-side automation) can fetch an upload given the plain link a user shared, without an admin login session. Typical use: a user posts a logdrop link in a GitHub issue, and your agent reads the log to help triage it.

The endpoint is **disabled** unless the instance operator sets `AGENT_API_TOKEN`. When it's set, the [admin dashboard](./admin-dashboard#header) shows *AI agent access enabled.*

:::warning[Keep the token private]
`AGENT_API_TOKEN` grants read access to **every** upload on the instance. Store it only in your own agent/automation configuration. Never share it with uploaders, never put it in a link, never commit it to a repository.
:::

---

## Request

```http
GET /api/agent/paste/<slug>
Authorization: Bearer <AGENT_API_TOKEN>
```

The `<slug>` is the last part of the share link: for `https://logdrop.example/r/Qm3vT8kLx2RpZ9aW4nYc1g` it's `Qm3vT8kLx2RpZ9aW4nYc1g`.

```bash
curl -H "Authorization: Bearer $AGENT_API_TOKEN" \
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

## Errors

| Status | Body | Meaning |
|---|---|---|
| `401` | `Unauthorized` | Missing or wrong `Authorization` header. |
| `404` | `Not found` | No upload with that slug, or it has already expired (even if the daily cleanup hasn't deleted it yet). |
| `500` | `Server misconfigured` | `AGENT_API_TOKEN` isn't set on this instance (or on this Vercel environment), so the endpoint is off. |

---

## Read tracking

Every successful read (`200`) is recorded on the upload: the read count goes up by one and the last-access time is updated. Maintainers see this as:

- a **robot badge** next to the slug in the [dashboard](./admin-dashboard#badges);
- **Read by AI agent N time(s) · last `<date>`** in the [log view](./log-view#activity).

Failed requests (`401`, `404`) are not recorded. Recording is best-effort: if the metadata write fails, the agent still gets its response, and two reads landing at the very same moment may be counted as one.
