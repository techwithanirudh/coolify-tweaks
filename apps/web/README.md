# Coolify Tweaks Web

The web app is the landing page for Coolify Tweaks. It shares packages from the Turborepo and consumes the compiled style during development.

## Getting Started

```bash
# Install dependencies (from repo root)
pnpm install

# Launch the dev server
pnpm --filter @repo/web dev

# Run linting, type checking, and tests
pnpm --filter @repo/web lint
pnpm --filter @repo/web typecheck
pnpm --filter @repo/web test
```

The app runs on `http://localhost:3000` by default. Environment variables can be configured via `.env` in the repository root (see `.env.example`).

## Features

- Next.js 15 with React 19
- Tailwind CSS v4 (using shared config in `tooling/tailwind`)
- Shared UI primitives sourced from `packages/ui`
- Drizzle ORM integration via `packages/db`

## Project Structure

```text
apps/web
├── public/           # static assets
├── src/              # application source
├── tsconfig.json
├── eslint.config.ts
└── package.json
```

## Deployment

You can deploy the web app to Vercel or any platform that supports Next.js 15. When using Vercel:

1. Set the project root to `apps/web`.
2. Add required environment variables (e.g., `POSTGRES_URL`) to the project.
3. Deploy via `vercel` CLI or Git integration.

## Contributing

When introducing new components, prefer generating them through the shared `ui` package so they can be reused across the repo:

```bash
pnpm ui-add
```
