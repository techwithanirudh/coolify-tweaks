# Coolify Tweaks Docs

The docs app is the landing + docs page for Coolify Tweaks. It shares packages from the Turborepo and consumes the compiled style during development.

## Getting Started

```bash
# Install dependencies (from repo root)
pnpm install

# Launch the dev server
pnpm --filter @repo/docs dev

# Run linting, type checking, and tests
pnpm --filter @repo/docs lint
pnpm --filter @repo/docs typecheck
pnpm --filter @repo/docs test
```

The app runs on `http://localhost:3000` by default (docs site). Environment variables can be configured via `.env` in the repository root (see `.env.example`).

## Features

- Next.js 15 with React 19
- Tailwind CSS v4 (using shared config in `tooling/tailwind`)
- Shared UI primitives sourced from `packages/ui`

## Project Structure

```text
apps/docs
├── public/           # static assets
├── src/              # application source
├── tsconfig.json
├── eslint.config.ts
└── package.json
```

## Deployment

You can deploy the web app to Vercel or any platform that supports Next.js 15. When using Vercel:

1. Set the project root to `apps/docs`.
2. Add required environment variables (e.g., `OPENAI_API_KEY`) to the project.
3. Deploy via `vercel` CLI or Git integration.

## Contributing

When introducing new components, prefer generating them through the shared `ui` package so they can be reused across the repo:

```bash
pnpm ui-add
```
