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
   - CSS `@updateURL` does not include any `id` parameter.
   - `sessions` has a new row.
   - `events` has an `install` event logged.

### Check 2: Same IP logs update to same session

1. Request again with same IP:

```
curl -i -H "x-forwarded-for: 1.1.1.1" \
  "http://localhost:8080/release/latest/?asset=main.user.css"
```

2. Verify:
   - No new session row.
   - New `events` row with `eventType = 'update'`.

### Check 3: Different IP creates a new session

1. Request with a new IP:

```
curl -i -H "x-forwarded-for: 2.2.2.2" \
  "http://localhost:8080/release/latest/?asset=main.user.css"
```

2. Verify:
   - New `sessions` row is created.
   - New `events` row is `install`.

### Check 4: Theme parameter is logged

1. Request with theme:

```
curl -i -H "x-forwarded-for: 3.3.3.3" \
  "http://localhost:8080/release/latest/?asset=main.user.css&theme=c1234567890abcdef1234567"
```

2. Verify:
   - `events.theme` has the theme value.

## Additional Edge Cases

### 5: notrack overrides everything

```
curl -i -H "x-forwarded-for: 6.6.6.6" \
  "http://localhost:8080/release/latest/?asset=main.user.css&notrack=1"
```

Expect: no session created, no events logged, updateURL keeps `notrack=1`.

### 6: HASH_SALT missing

1. Temporarily unset `HASH_SALT` and restart API.
2. Make a request:

```
curl -i \
  "http://localhost:8080/release/latest/?asset=main.user.css"
```

Expect: session created, `firstIpHash`/`lastIpHash` remain null, no IP-based matching.

### 7: UpdateURL preserves asset + theme + notrack

1. Request:

```
curl -i -H "x-forwarded-for: 7.7.7.7" \
  "http://localhost:8080/release/latest/?asset=main.user.css&theme=c1234567890abcdef1234567&notrack=1"
```

2. Verify `@updateURL` still includes `asset=main.user.css`, `theme=...`, `notrack=1`.

Note: `@updateURL` only exists in `main.user.css`.

### 8: main.css vs main.user.css

1. Request `asset=main.css` with theme.
2. Verify `events.asset` and updateURL reflect `main.css`.

### 9: Event insert failure safety

Simulate DB failure (stop Postgres) and request:

Expect: no ID embedded (avoid phantom IDs) and no session created.

### 10: Theme not found should log status

1. Request with a valid-format theme that does not exist:

```
curl -i -H "x-forwarded-for: 19.19.19.19" \
  "http://localhost:8080/release/latest/?asset=main.user.css&theme=c1234567890abcdef12345678"
```

2. Verify:
   - HTTP status is 404.
   - `events.status_code` reflects 404.
