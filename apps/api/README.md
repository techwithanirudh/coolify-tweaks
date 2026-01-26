# Coolify Tweaks API

A lightweight Nitro server that serves `coolify-tweaks` release assets with optional [TweakCN](https://tweakcn.com) theme injection. It keeps the userstyle install links fast, consistent, and free from GitHub CDN hiccups.

## Why This Exists

- **Bypass CDN quirks**: serve release assets directly without CORS surprises.
- **Dynamic theme injection**: apply TweakCN themes on demand so every install link stays themed.
- **Edge-friendly**: deploys on Vercel (Nitro) with smart caching and global reach.

## Quick Start

```bash
# Install workspace dependencies first (from repo root)
pnpm install

# Run the API locally
pnpm --filter @repo/api dev
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

1. Create a new Vercel project and set the root directory to `apps/api`.

2. Vercel automatically detects the Nitro preset; no extra build settings are required.

3. Add any required environment variables.

4. Done! Your app should successfully deploy.

### Manual Deploy

```bash
# Using Vercel CLI
vercel deploy
```
