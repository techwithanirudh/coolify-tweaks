# Contributing

> [!NOTE]  
> Make sure to follow the system requirements specified in [`package.json#engines`](./package.json#engines) before proceeding.

Welcome! This is a quick reference guide. For detailed documentation, visit the [Development docs](https://coolify-tweaks.techwithanirudh.com/docs/development).

## Prerequisites

- **Node.js** `^22.21.0`
- **PNPM** `^10.19.0`
- **Bun** `^1.3.0` (used for the TypeScript scripts that power docs and style)

## Quick start

1. **Clone and setup:**

   ```bash
   git clone https://github.com/techwithanirudh/coolify-tweaks.git
   cd coolify-tweaks
   pnpm install
   cp .env.example .env
   ```

2. **Run the apps:**

   ```bash
   pnpm dev
   ```

3. **Before pushing:**
   ```bash
   pnpm lint
   pnpm format
   pnpm typecheck
   pnpm check:spelling
   ```

## Repository structure

Coolify Tweaks is a Turborepo monorepo with:

- **`apps/`** - Style (Sass pipeline), API (Nitro server), Docs (Next.js site)
- **`packages/`** - Shared packages (`@repo/ui`, `@repo/validators`)
- **`tooling/`** - Shared configs (ESLint, Prettier, Tailwind, TypeScript, cspell)

All internal packages are scoped under `@repo/*`.

## Learn more

For detailed guides on working with each app, see the [Development documentation](https://coolify-tweaks.techwithanirudh.com/docs/development):

- **[Getting started](https://coolify-tweaks.techwithanirudh.com/docs/development)** - Prerequisites, repository layout, and quick start
- **[Style app](https://coolify-tweaks.techwithanirudh.com/docs/development/style)** - Working with the Sass pipeline
- **[API app](https://coolify-tweaks.techwithanirudh.com/docs/development/api)** - Working with the Nitro API
- **[Docs app](https://coolify-tweaks.techwithanirudh.com/docs/development/docs)** - Working with the documentation site
- **[Tooling](https://coolify-tweaks.techwithanirudh.com/docs/development/tooling)** - Shared configuration packages

## Commits and PRs

- **Branch names:** Use descriptive names like `feat/new-theme-toggle`, `fix/docs-typo`
- **Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`)
- **PRs:** Keep them focused and ensure all checks pass

## Need help?

If you get stuck, open an issue or a draft PR with what you tried and any error output.
