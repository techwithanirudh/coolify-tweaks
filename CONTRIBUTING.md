# Contributing

> [!NOTE]  
> Make sure to follow the system requirements specified in [`package.json#engines`](./package.json#L4) before proceeding.

Coolify Tweaks lives in a Turborepo monorepo. You do not need to understand every workspace to be useful, but this guide gives you a practical overview of where things live, how to run them, and where to make changes.

## Table of contents

- [Prerequisites](#prerequisites)
- [Repository layout](#repository-layout)
- [Quick start](#quick-start)
- [Apps](#apps)
- [Shared packages](#shared-packages)
- [Tooling](#tooling)
- [Core scripts and commands](#core-scripts-and-commands)
- [Branches, commits, and prs](#branches-commits-and-prs)
- [Release flow](#release-flow)

## Prerequisites

To work on this repo locally you should have:

- **Node.js** `^22.21.0`
- **PNPM** `^10.19.0`
- **Bun** `^1.0.0` (used for TypeScript scripts in docs and style pipelines)
- A **Postgres / Neon database URL** if you are touching analytics or the API

## Repository layout

Let's quickly learn about the repository structure.

It uses [Turborepo](https://turborepo.com) and contains:

```text
.github
  └─ workflows
        ├─ CI with PNPM cache setup
        └─ Release pipepline
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ docs
  │   ├─ Next.js 16 docs + website
  │   ├─ Fumadocs
  │   ├─ React 19
  │   └─ Tailwind CSS v4
  ├─ api
  │   └─ Nitro server that proxies GitHub release assets
  └─ style
      └─ Standalone SASS pipeline for Coolify theming
packages
  ├─ db
  │   └─ Typesafe DB calls using Drizzle & Neon
  └─ ui
      └─ UI package for the website using shadcn/ui
tooling
  ├─ eslint
  │   └─ shared, fine-grained, eslint presets
  ├─ prettier
  │   └─ shared prettier configuration
  ├─ tailwind
  │   └─ shared tailwind theme and configuration
  ├─ cspell
  │   └─ shared cspell configuration
  └─ typescript
      └─ shared tsconfig you can extend from
turbo
  ├─ eslint
  │   └─ `pnpm turbo gen init` templates
package.json
pnpm-workspace.yaml
turbo.json
```

All internal packages are scoped as `@repo/*`.

## Quick start

### 1. Clone the repo

```bash
git clone https://github.com/techwithanirudh/coolify-tweaks.git
cd coolify-tweaks
```

### 2. Install dependencies and env

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env
```

### 3. Push the database (only if you need analytics)

```bash
pnpm db:push
```

If you are not touching analytics or API routes that hit the database, you can skip this.

### 4. Run the pieces you care about

From the repo root:

```bash
# Style-only Sass watcher (serves CSS at http://localhost:3000)
pnpm --filter @repo/style dev

# Docs site on http://localhost:3002
pnpm --filter @repo/docs dev

# API server on http://localhost:3001 (optional)
pnpm --filter @repo/api dev
```

Or run everything via Turbo:

```bash
pnpm dev
```

### 5. Run checks before you push

```bash
pnpm lint
pnpm format
pnpm typecheck
pnpm check:spelling
```

If you get stuck, open an issue or a draft PR with what you tried and any error output.

## Apps

### Style (`apps/style`)

#### Overview

The Style app powers the actual Coolify theme. It:

- Takes SCSS sources and runs them through Sass, Lightning CSS, and PostCSS
- Outputs `dist/main.user.css` as the primary artifact
- Feeds:
  - The API, which serves the CSS to external clients

If the UI looks different, you probably touched this app.

#### Development

```bash
pnpm --filter @repo/style dev
```

This will:

- Serve `http://localhost:3000/main.user.css` and `http://localhost:3000/main.user.css'
  - main.user.css is the stylus user style.
  - main.css is the built css without stylus modifications.
- Watch `apps/style/src/**` for changes
- Rebuild CSS as you edit SCSS files

Recommended workflow for theme work:

1. Install Stylus browser extension.
2. Run the dev command above.
3. Open `http://localhost:3000/main.user.css` in your browser, and turn on Live Reload in stylus.
4. Edit SCSS and refresh Coolify to see changes live.

#### File layout

```text
apps/style
├── dist/              # Built CSS bundles
├── plugins/
│   └── postcss/       # Custom PostCSS plugins (banner, theme identifier, moz wrapping)
├── scripts/           # Build and watch helpers
└── src/
    ├── components/    # Component level styling (sidebar, cards, navbar, etc)
    ├── pages/         # Page specific tweaks (deployments, resources, onboarding)
    ├── theme/         # Variables, base reset, typography
    ├── utilities/     # Misc helpers and overrides
    ├── _globals.scss
    ├── _mixins.scss
    └── main.scss      # Entry point that includes everything
```

#### Deployment

Build the production stylesheet:

```bash
pnpm --filter @repo/style build
```

This generates:

- `dist/main.user.css`
- `dist/main.css`
- Source maps

These are then picked up by the API (on release) and made available for download or dynamic serving.

### API (`apps/api`)

#### Overview

The API app is a Nitro server that:

- Proxies GitHub release assets
- Serves the published CSS bundles
- Exposes health checks
- Handles analytics and diagnostics when configured

If you are working on how users fetch styles programmatically or on tracking usage, you are probably in this app.

#### Development

```bash
pnpm --filter @repo/api dev
```

Default:

- Runs at `http://localhost:3001`

Environment:

- Needs `POSTGRES_URL` only if you are using analytics routes.
- Will still serve static release assets without a database.

#### File layout

```text
apps/api
├── src/
│   ├── routes/
│   │   ├── health/          # Health checks
│   │   ├── index.ts         # Root route
│   │   └── release/[tag]/   # Release asset proxying
│   ├── middleware/          # CORS and other middleware
│   ├── hooks/               # Nitro lifecycle hooks
│   └── utils/               # CSS compiler/transformers, Stylus helpers, etc
├── nitro.config.ts
└── package.json
```

#### Deployment

#### Vercel

1. Create a new Vercel project.
2. Set the root directory to `apps/api`.
3. Vercel will auto detect Nitro and the correct build output.
4. Configure required environment variables, for example:
   - `POSTGRES_URL` for analytics
5. Deploy. Once live, the API will:
   - Serve release assets
   - Proxy CSS generated by Style
   - Respond to health checks

### Docs (`apps/docs`)

#### Overview

The docs app is the public website and documentation hub. It is built with:

- Next.js 16
- React 19
- Tailwind CSS v4
- Fumadocs (for the docs system)
- `@repo/ui` and shared tooling

It owns the landing page, docs, API docs, and any AI/search experiences.

#### Development

```bash
pnpm --filter @repo/docs dev
```

Default:

- Runs at `http://localhost:3002`

Notes:

- Uses Bun for some scripts (see `scripts/`).
- Fumadocs has some caching; if MDX metadata changes heavily and things feel stuck, a restart often helps.
- If you want to re-generate the OpenAPI or Changelog run `pnpm run build:pre` in `apps/docs`.

#### File layout

```text
apps/docs
├── content/
│   └── docs/
│       ├── style/            # Style docs: installation, updating, theming, changelog
│       ├── api/              # Generated API docs for the Nitro API
│       └── meta.json         # Fumadocs navigation metadata
├── scripts/                  # generate-docs, sync-changelog, lint helpers
├── src/
│   ├── app/
│   │   ├── (home)/           # Marketing homepage and its components
│   │   ├── docs/             # Fumadocs powered docs routes
│   │   ├── api/              # Next API routes (chat, search, etc)
│   │   └── og/               # OG image generation
│   ├── components/           # Reusable UI components
│   ├── lib/                  # AI wiring, OpenAPI, metadata, page tree, etc
│   ├── styles/               # Tailwind entry CSS
│   └── utils/                # Small helpers
└── package.json
```

#### Deployment

#### Vercel

1. New project, root directory `apps/docs`.
2. Vercel detects Next.js automatically.
3. Configure environment variables (analytics, Sentry, etc).
4. Deploy. The docs site will pull in:
   - `@repo/ui`
   - Shared Tailwind configuration from `tooling/tailwind`
   - Generated OpenAPI docs from the API

## Shared packages

### `@repo/db`

- Drizzle ORM schema and DB client.
- Used by the API for analytics and any future DB powered features.

Development:

```bash
pnpm --filter @repo/db test
pnpm --filter @repo/db build
```

Files to care about:

- `src/schema.ts` for tables and relationships
- `src/client.ts` for DB client setup
- `drizzle.config.ts` for migrations

After schema changes for local use:

```bash
pnpm db:push
```

### `@repo/ui` 

- Shadcn based UI library, shared between docs (and any future apps).
- Tailwind v4 aware, uses shared tooling.

Add components:

```bash
pnpm ui-add
```

This runs an interactive `shadcn/ui` generator and wires components into `packages/ui/src`.

Development notes:

- Any breaking change here will usually surface as a docs build or runtime error first.
- Tailwind tokens are defined in `tooling/tailwind`.

### `@repo/validators` (`packages/validators`)

- Shared Zod schemas and validation helpers.
- Used where both API and docs need to agree on shapes.

## Tooling

Most of the configuration is centralized under `tooling/`:

- **`tooling/eslint`**
  Shared ESLint presets. Apps and packages extend these.

- **`tooling/prettier`**
  Single Prettier config used across the monorepo.

- **`tooling/tailwind`**
  Tailwind v4 theme, config, and PostCSS glue.

- **`tooling/cspell`**
  Shared spelling configuration to keep docs and code consistent.

- **`tooling/typescript`**
  Base TS configs extended by apps and packages.

## Core scripts and commands

From the repo root:

- `pnpm dev`
  - Run all `dev` targets via Turbo.

- `pnpm dev:web` / `pnpm dev:api` / `pnpm dev:style`
  - Turbo entry points to focus on one app.

- `pnpm build`
  - Run all `build` pipelines.

- `pnpm typecheck`
  - TypeScript across apps and packages.

- `pnpm format` / `pnpm format:fix`
  - Prettier using the shared config.

- `pnpm lint` / `pnpm lint:fix`
  - ESLint with repo presets.

- `pnpm check:spelling`
  - cspell spelling check.

- `pnpm ui-add`
  - Add shadcn/ui components to `@repo/ui`.

- `pnpm turbo gen init`
  - Scaffold a new package with `package.json`, `tsconfig`, eslint, and build scripts wired up.

## Branches, commits, and PRs

- **Branch names**
  Use descriptive names like:
  - `feat/new-theme-toggle`
  - `fix/docs-typo`
  - `chore/update-deps`

- **Commits**
  Follow Conventional Commits:
  - `feat: ...`
  - `fix: ...`
  - `docs: ...`
  - `chore: ...`

- **PRs**
  Keep them focused. One feature or bugfix per PR is ideal.

- **Checks**
  Before pushing, make sure:

  ```bash
  pnpm lint
  pnpm format
  pnpm typecheck
  pnpm check:spelling
  ```

Commitlint and Lefthook enforce the commit style and run checks on `commit-msg`. GitHub Actions mirror these checks in CI.

## Release flow

Releases are coordinated with Changesets.

- `pnpm release`
  - Runs builds
  - Runs `changeset publish`
  - Tags and publishes packages

`.github/workflows/release.yml`:

- Drives the GitHub side of releases.
- Triggers downstream deploys for Style, Docs, and API.

As a contributor, you typically do not run the release flow yourself. Just keep your PR green and the maintainers will handle publish and deploy.
