## Analytics Tracking Manual Test Guide

This guide is for AI agents and developers to verify analytics tracking logic.
It assumes a local dev setup and a Postgres database configured via `POSTGRES_URL`.

### Preconditions

1. Ensure `.env` includes:

```
POSTGRES_URL=postgresql://...
HASH_SALT=your-secret-salt
```

2. Install dependencies:

```
pnpm install
```

3. Start the API dev server in one terminal:

```
pnpm --filter @repo/api dev
```

The API should be at `http://localhost:8080`.

### Notes on Requests

- Use `x-forwarded-for` to simulate different client IPs.
- Use `-i` on curl to capture headers and the userstyle body.
- The `@updateURL` is in the CSS metadata for `main.user.css`.
- `main.css` does not include userstyle metadata, so it will not contain `@updateURL`.
- Theme IDs must match `^c[a-z0-9]{24}$` (25 chars total). Invalid theme IDs are ignored by analytics.

Example curl:

```
curl -i \
  -H "x-forwarded-for: 1.1.1.1" \
  "http://localhost:8080/release/latest/?asset=main.user.css"
```

### Database Helpers

You must have `psql` installed. Installing `psql` without a confirmation prompt is required (non-interactive installs only).

Run SQL against the database configured in `POSTGRES_URL`:

```
psql "$POSTGRES_URL"
```

Common queries:

```
SELECT * FROM sessions ORDER BY firstSeenAt DESC LIMIT 5;
SELECT * FROM events ORDER BY createdAt DESC LIMIT 5;
```

## Core Checks (Requested)

### Check 1: New request creates session + updateURL + install event

1. Request:

```
curl -i -H "x-forwarded-for: 1.1.1.1" \
  "http://localhost:8080/release/latest/?asset=main.user.css"
```

2. Verify:
   - CSS `@updateURL` contains `?id=<sessionId>`.
   - `sessions` has a new row with that `id`.
   - `events` has an `install` event for that `sessionId`.

### Check 2: Same IP, no session ID, logs update to same session

1. Request again with same IP, no id:

```
curl -i -H "x-forwarded-for: 1.1.1.1" \
  "http://localhost:8080/release/latest/?asset=main.user.css"
```

2. Verify:
   - No new session row.
   - New `events` row with `eventType = 'update'`.

### Check 3: UpdateURL used with different IP

1. Extract the `id` from `@updateURL` in Check 1.
2. Request with a new IP:

```
curl -i -H "x-forwarded-for: 2.2.2.2" \
  "http://localhost:8080/release/latest/?asset=main.user.css&id=<id>"
```

3. Verify:
   - `events` row has new `ipHash`.
   - `sessions.lastIpHash` is updated to new hash.

### Check 4: Theme parameter is logged

1. Request with theme:

```
curl -i -H "x-forwarded-for: 3.3.3.3" \
  "http://localhost:8080/release/latest/?asset=main.user.css&theme=c1234567890abcdef1234567"
```

2. Verify:
   - `events.theme` has the theme value.

### Check 5: Session ID provided but missing in DB

1. Request with a fake ID:

```
curl -i -H "x-forwarded-for: 4.4.4.4" \
  "http://localhost:8080/release/latest/?asset=main.user.css&id=abc123"
```

2. Verify:
   - New session created with `id = abc123`.
   - `events` row is `install`.

### Check 6: Return to original IP after IP change

1. Use the `id` from Check 3.
2. Send request from original IP:

```
curl -i -H "x-forwarded-for: 1.1.1.1" \
  "http://localhost:8080/release/latest/?asset=main.user.css&id=<id>"
```

3. Verify:
   - `events` uses same `sessionId`.
   - `sessions.firstIpHash` unchanged.
   - `sessions.lastIpHash` updated to original IP hash.

## Additional Edge Cases

### 7: Invalid session ID (bad format)

```
curl -i -H "x-forwarded-for: 5.5.5.5" \
  "http://localhost:8080/release/latest/?asset=main.user.css&id=BAD123"
```

Expect: ID ignored, behavior falls back to IP or creates new session.

### 8: notrack overrides everything

```
curl -i -H "x-forwarded-for: 6.6.6.6" \
  "http://localhost:8080/release/latest/?asset=main.user.css&notrack=1&id=abc123"
```

Expect: no session created, no events logged, updateURL keeps `notrack=1`.

### 9: HASH_SALT missing

1. Temporarily unset `HASH_SALT` and restart API.
2. Make a request:

```
curl -i \
  "http://localhost:8080/release/latest/?asset=main.user.css&id=abc123"
```

Expect: session created (by ID), `firstIpHash`/`lastIpHash` remain null, no IP-based matching.

### 10: IP changes without session ID

1. Request from IP A without ID.
2. Request from IP B without ID.

Expect: two separate sessions (no linking across IPs).

### 11: Session ID used from multiple IPs

1. Use a known session ID with IP A, then IP B.

Expect: same session ID, `lastIpHash` updates, `firstIpHash` stays from the initial IP.

### 12: UpdateURL preserves asset + theme + notrack

1. Request:

```
curl -i -H "x-forwarded-for: 7.7.7.7" \
  "http://localhost:8080/release/latest/?asset=main.user.css&theme=c1234567890abcdef1234567&notrack=1"
```

2. Verify `@updateURL` still includes `asset=main.user.css`, `theme=...`, `notrack=1`.

Note: `@updateURL` only exists in `main.user.css`.

### 13: main.css vs main.user.css

1. Request `asset=main.css` with theme.
2. Verify `events.asset` and updateURL reflect `main.css`.

### 14: Event insert failure safety

Simulate DB failure (stop Postgres) and request with `id=abc123`.

Expect: no ID embedded (avoid phantom IDs) and no session created.

### 15: Duplicate session ID race

Simulate two concurrent requests with same `id` from different IPs.

Expect: only one session row, events recorded for both requests.

### 16: Theme not found should log status

1. Request with a valid-format theme that does not exist:

```
curl -i -H "x-forwarded-for: 19.19.19.19" \
  "http://localhost:8080/release/latest/?asset=main.user.css&theme=c1234567890abcdef12345678"
```

2. Verify:
   - HTTP status is 404.
   - `events.status_code` reflects 404.
