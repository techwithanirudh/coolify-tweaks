# Coolify Tweaks API

A lightweight Nitro server that serves `coolify-tweaks` release assets with optional [TweakCN](https://tweakcn.com) theme injection. It keeps the userstyle install links fast, consistent, and free from GitHub CDN hiccups.

## Why This Exists

- **Bypass CDN quirks** – serve release assets directly without CORS surprises.
- **Dynamic theme injection** – apply TweakCN themes on demand so every install link stays themed.
- **Edge-friendly** – deploys on Vercel (Nitro) with smart caching and global reach.

## Quick Start

### Users

```bash
# Latest release with default styling
curl "https://tweaks-api.yourdomain.com/release/latest"

# Apply a TweakCN theme
curl "https://tweaks-api.yourdomain.com/release/latest?theme=claude"

# Request a specific asset
curl "https://tweaks-api.yourdomain.com/release/latest?asset=coolify-tweaks.zip"
```

### Contributors

```bash
# Install workspace dependencies first (from repo root)
pnpm install

# Run the API locally
pnpm --filter @repo/api dev

# Run the test suite (if applicable)
pnpm --filter @repo/api test
```

## API Reference

### `GET /release/:tag`

Fetch a release asset (defaults to `main.user.css`) with optional theme injection.

- `asset` – asset filename, defaults to `main.user.css`
- `theme` – TweakCN theme identifier for CSS transformation

Examples:

- `/release/latest`
- `/release/v3.8.10`
- `/release/latest?theme=claude`
- `/release/latest?asset=coolify-tweaks.zip`

### `GET /api/health`

Returns service status information for monitoring.

### `GET /api/`

Simple index of available endpoints and usage notes.

## Theme Integration

1. Client requests CSS with `?theme=<theme-id>`.
2. API fetches the base userstyle asset from GitHub.
3. Server pulls the requested theme from TweakCN and injects its variables.
4. Post-processing rewrites the CSS so it is ready to install with Stylus.

Browse available themes at [TweakCN → Themes](https://tweakcn.com/themes).

## Deployment

### Deploy to Vercel

1. Create a Vercel project with the root directory set to `apps/api`.
2. Vercel detects Nitro automatically—no extra build configuration needed.
3. Copy any required environment variables from `.env` into your Vercel project.
4. Deploy via `vercel` CLI or by pushing to the configured branch.

### Manual Deploy

```bash
# Using Vercel CLI
vercel deploy
```

## Contributing

We welcome improvements! Fork the repo, make your changes, and open a PR. Be sure to run any relevant checks (lints/tests) before submitting.

## License

MIT – see the [LICENSE](../../LICENSE) file for details.

---

<div align="center">
  <strong>Made with love for the Coolify community</strong><br />
  <a href="https://github.com/techwithanirudh/coolify-tweaks">Coolify Tweaks</a> •
  <a href="https://tweakcn.com">TweakCN</a> •
  <a href="https://coolify.io">Coolify</a>
</div>
