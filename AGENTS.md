# AGENTS.md

This file provides comprehensive guidance for AI agents and developers working with the Coolify Tweaks codebase. It consolidates all contributing guidelines, coding standards, and project conventions.

## Project Overview

Coolify Tweaks is a userstyle that enhances Coolify's UI with opinionated tweaks, spacing, colors, and layout fixes. The project is built as a **Turborepo monorepo** with multiple applications and shared packages.

**Repository:** https://github.com/techwithanirudh/coolify-tweaks  
**Documentation:** https://coolify-tweaks.techwithanirudh.com  
**License:** MIT

## System Requirements

Before working on this codebase, ensure you have:

| Requirement | Version                                                  |
| ----------- | -------------------------------------------------------- |
| Node.js     | `^24.11.0` (see `.nvmrc`)                                |
| PNPM        | `^10.19.0`                                               |
| Bun         | `^1.3.0` (for TypeScript scripts in docs and style apps) |

Optional:

- **PostgreSQL / Neon** `POSTGRES_URL` - Required if working on analytics or the API

## Repository Structure

```
coolify-tweaks/
├── apps/                    # Application packages
│   ├── api/                 # @repo/api - Nitro server for dynamic style builds
│   ├── docs/                # @repo/docs - Next.js documentation site (Fumadocs)
│   └── style/               # @repo/style - Sass pipeline for userstyle CSS
├── packages/                # Shared packages
│   ├── db/                  # @repo/db - Drizzle ORM database layer
│   ├── ui/                  # @repo/ui - Shared React UI components (shadcn/ui)
│   └── validators/          # @repo/validators - Zod validation schemas
├── tooling/                 # Shared configuration packages
│   ├── cspell/              # @repo/cspell-config - Spell checking configuration
│   ├── eslint/              # @repo/eslint-config - ESLint configuration
│   ├── github/              # GitHub Actions setup composite action
│   ├── prettier/            # @repo/prettier-config - Prettier configuration
│   ├── tailwind/            # @repo/tailwind-config - Tailwind CSS configuration
│   └── typescript/          # @repo/tsconfig - TypeScript configuration
├── .changeset/              # Changesets for version management
├── .github/                 # GitHub workflows and templates
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # PNPM workspace configuration
```

All internal packages are scoped under `@repo/*`.

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/techwithanirudh/coolify-tweaks.git
cd coolify-tweaks
pnpm install
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your values:

```env
# Database (required for API/analytics)
POSTGRES_URL="postgresql://[USERNAME]:[PASSWORD]@[host]/neondb?sslmode=require"

# OpenAI (for docs AI features)
OPENAI_API_KEY="sk-proj-..."

# URLs
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_DOCS_URL="http://localhost:3000"
```

### 3. Sync the Database (Optional)

Only if you need analytics:

```bash
pnpm db:push
```

### 4. Run Development Servers

```bash
# Run all apps
pnpm dev

# Run specific apps using filter
pnpm --filter @repo/style dev   # Style watcher (rebuilds CSS)
pnpm --filter @repo/docs dev    # Docs site (port 3000)
pnpm --filter @repo/api dev     # API server (port 8080)

# Or use the shorthand scripts
pnpm dev:web      # Docs site only
pnpm dev:style    # Style app only
pnpm dev:api      # API server only
```

### 5. Before Pushing

Always run these checks before pushing:

```bash
pnpm lint          # ESLint
pnpm format        # Prettier check
pnpm typecheck     # TypeScript type checking
pnpm check:spelling # CSpell spell checking
```

## Application Details

### Style App (`apps/style/`)

The Sass + Lightning CSS pipeline that produces the Coolify theme.

- **Package:** `@repo/style`
- **Tech:** Sass, PostCSS, LightningCSS
- **Entry:** `src/main.scss`
- **Output:** `dist/`

**Build outputs:**

- `dist/main.user.css` - Stylus-friendly build with userstyle metadata
- `dist/main.css` - Raw CSS bundle for Traefik dynamic-config install

**File Layout:**

```
apps/style/
├── dist/              # Built CSS bundles
├── plugins/
│   └── postcss/       # Custom PostCSS plugins (banner, theme identifier, moz wrapping)
├── scripts/           # Build and watch helpers
├── src/
│   ├── components/    # Component level styling (sidebar, cards, navbar, etc)
│   ├── pages/         # Page specific tweaks (deployments, resources, onboarding)
│   ├── theme/         # Variables, base reset, typography
│   ├── utilities/     # Misc helpers and overrides
│   ├── _globals.scss
│   ├── _mixins.scss
│   └── main.scss      # Entry point that includes everything
└── package.json
```

**Local Workflow:**

1. Start the watcher: `pnpm --filter @repo/style dev`
2. Start the API server: `pnpm --filter @repo/api dev`
3. Install the stylesheet in Stylus from `http://localhost:8080/release/latest`
4. Edit Sass partials under `apps/style/src/` - changes are reflected immediately
5. Update documentation when changing installation or update behavior

**Testing:**

```bash
pnpm --filter @repo/style lint
pnpm --filter @repo/style format
pnpm --filter @repo/style typecheck
pnpm --filter @repo/style check:spelling
```

### API App (`apps/api/`)

Nitro server that serves dynamic style builds with TweakCN theme injection. In development, it reads CSS directly from the style app's `dist/` folder for instant feedback.

- **Package:** `@repo/api`
- **Tech:** Nitro, PostCSS, LightningCSS
- **Dev port:** 8080

**File Layout:**

```
apps/api/
├── src/
│   ├── routes/
│   │   ├── index.ts           # Root route handler
│   │   ├── health/
│   │   │   └── index.ts       # Health check endpoints
│   │   └── release/
│   │       └── [tag]/
│   │           └── index.ts   # Release proxy
│   ├── middleware/
│   │   └── cors.ts            # CORS configuration
│   ├── utils/
│   │   ├── css-compiler.ts
│   │   ├── css-transformer.ts
│   │   └── themes.ts
│   └── config.ts              # App configuration
├── nitro.config.ts            # Nitro configuration
└── package.json
```

**Routes:**

- `GET /release/latest/?asset=main.css` - Serves the latest CSS bundle
- `GET /release/[tag]/[asset]` - Serves specific release assets
- `GET /health` - Basic health check

**Theme Injection:**

The API supports dynamic theme injection for `main.user.css` requests:

1. **Build-time markers**: The Style app's PostCSS plugin injects comment markers around CSS variable definitions:

   ```css
   /* ==UI-THEME-VARS:START== */
   :root { --background: #fdfdfd; ... }
   .dark { --background: #1f1c23; ... }
   /* ==UI-THEME-VARS:END== */
   ```

2. **Theme request flow**: When requesting CSS with `?theme=<theme-id>`:
   - Fetches base CSS from GitHub releases
   - Fetches theme data from TweakCN using the theme ID
   - Converts theme CSS variables using `cssVarsToCss()`
   - Transforms CSS using Lightning CSS for browser compatibility
   - Replaces content between `UI-THEME-VARS` markers
   - Updates `updateURL` in userstyle metadata to preserve theme parameter

3. **Implementation files**:
   - `themes.ts`: `getThemeCss()` and `processContent()` for theme handling
   - `css-transformer.ts`: `cssVarsToCss()` for variable conversion
   - `css-compiler.ts`: `transformCss()` for Lightning CSS transformations

**Local Workflow:**

1. Start the dev server: `pnpm --filter @repo/api dev`
2. Edit routes under `apps/api/src/routes/` or utilities in `apps/api/src/utils/`
3. For database changes: `pnpm db:push` to sync Drizzle schema
4. Configure environment variables in `.env`

**Testing:**

```bash
pnpm --filter @repo/api lint
pnpm --filter @repo/api format
pnpm --filter @repo/api typecheck
pnpm --filter @repo/api check:spelling
```

**Deployment (Vercel):**

1. Create a new Vercel project
2. Set root directory to `apps/api`
3. Configure `POSTGRES_URL` and other environment variables
4. Deploy - Vercel auto-detects Nitro

### Docs App (`apps/docs/`)

Next.js documentation site built with Fumadocs.

- **Package:** `@repo/docs`
- **Tech:** Next.js 16, Fumadocs, React 19, Tailwind CSS 4
- **Dev port:** 3000

**File Layout:**

```
apps/docs/
├── content/
│   └── docs/
│       ├── style/         # Style docs: installation, updating, theming, changelog
│       ├── api/           # Generated API docs for the Nitro API
│       └── development/   # Development/contributing docs
├── scripts/               # generate-docs, sync-changelog, lint helpers
├── src/
│   ├── app/
│   │   ├── (home)/        # Marketing homepage and components
│   │   ├── docs/          # Fumadocs powered docs routes
│   │   ├── api/           # Next API routes (chat, search, etc)
│   │   └── og/            # OG image generation
│   ├── components/        # Reusable UI components
│   ├── lib/               # AI wiring, OpenAPI, metadata, page tree, etc
│   ├── styles/            # Tailwind CSS
│   └── utils/             # Small helpers
└── package.json
```

**Local Workflow:**

1. Start the dev server: `pnpm --filter @repo/docs dev`
2. Edit MDX files under `apps/docs/content/docs/` or React components in `apps/docs/src/app/`
3. For OpenAPI or changelog changes, run pre-build: `pnpm --filter @repo/docs run build:pre`
4. Use in-browser search to navigate; restart dev server if Fumadocs metadata gets cached

**Scripts:**

- `bun ./scripts/lint.ts` - Lint MDX content and validate links
- `bun ./scripts/pre-build.ts` - Generate OpenAPI docs and sync changelog before build

**Adding UI Components:**

```bash
pnpm ui-add   # From repo root - adds to packages/ui/src/components
```

**Testing:**

```bash
pnpm --filter @repo/docs lint        # Also validates internal/external links in MDX
pnpm --filter @repo/docs format
pnpm --filter @repo/docs typecheck
pnpm --filter @repo/docs check:spelling
```

**Deployment (Vercel):**

1. Create a new Vercel project
2. Set root directory to `apps/docs`
3. Configure environment variables (analytics, Sentry, etc.)
4. Deploy - automatically pulls shared UI from `@repo/ui`

## Shared Packages

### Database (`packages/db/`)

Drizzle ORM database layer for PostgreSQL/Neon.

- **Package:** `@repo/db`
- **Exports:** `@repo/db`, `@repo/db/client`, `@repo/db/schema`

**Key Scripts:**

```bash
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Drizzle Studio
```

### UI Components (`packages/ui/`)

Shared React UI components using shadcn/ui.

- **Package:** `@repo/ui`
- **Exports:** `@repo/ui`, `@repo/ui/*`, `@repo/ui/hooks/*`

**Adding components:**

```bash
pnpm ui-add       # Interactive shadcn/ui component installer
```

### Validators (`packages/validators/`)

Shared Zod validation schemas.

- **Package:** `@repo/validators`
- **Exports:** `@repo/validators`

## Tooling Packages

All tooling packages are in `tooling/` and scoped under `@repo/*`.

### @repo/eslint-config

Shared ESLint presets for consistent code quality.

**Exports:**

- `base` - Base TypeScript and JavaScript rules
- `react` - React and React Hooks rules
- `nextjs` - Next.js specific rules

**Usage:**

```js
// eslint.config.js
import { baseConfig } from "@repo/eslint-config/base";
import { nextjsConfig } from "@repo/eslint-config/nextjs";
import { reactConfig } from "@repo/eslint-config/react";

export default [baseConfig, reactConfig, nextjsConfig];
```

### @repo/prettier-config

Shared Prettier configuration with automatic import sorting and Tailwind class sorting.

**Usage:**

```json
{
  "prettier": "@repo/prettier-config"
}
```

**Import order:** Type imports → React/Next.js → third-party → `@repo/*` → local imports

### @repo/tailwind-config

Shared Tailwind CSS v4 theme and PostCSS configuration.

**Exports:**

- `theme` - Tailwind theme CSS file
- `postcss-config` - PostCSS configuration

**Usage:**

```js
// postcss.config.js
import postcssConfig from "@repo/tailwind-config/postcss-config";

export default postcssConfig;
```

```css
@import "@repo/tailwind-config/theme";
```

### @repo/tsconfig

Base TypeScript configuration with strict type checking and modern bundler resolution.

**Usage:**

```json
{
  "extends": "@repo/tsconfig/base.json"
}
```

### @repo/cspell-config

Shared spellcheck configuration with custom dictionaries.

**Usage:**

```json
{
  "version": "0.2",
  "import": ["@repo/cspell-config"],
  "words": ["custom-word"]
}
```

## Coding Standards

### TypeScript

- **Config:** Extends `@repo/tsconfig` (see `tooling/typescript/base.json`)
- **Strict mode:** Enabled with `noUncheckedIndexedAccess`
- **Target:** ES2022
- **Module:** Preserve (bundler mode)

Key rules:

- Use type imports: `import type { Foo } from 'bar'`
- Unused variables must be prefixed with `_`
- No floating promises (disabled, but be mindful)
- No non-null assertions (`!`)

### ESLint

- **Config:** `@repo/eslint-config` with base, react, and nextjs presets
- Uses TypeScript-ESLint with recommended + stylistic rules
- Turbo plugin for monorepo cache optimization

Key rules:

- Consistent type imports (prefer top-level)
- No `process.env` access outside `env.ts` files (use `@/env` import)
- Unused disable directives are reported

### Prettier

- **Config:** `@repo/prettier-config`
- **Plugins:**
  - `@ianvs/prettier-plugin-sort-imports` - Import sorting
  - `prettier-plugin-tailwindcss` - Tailwind class sorting

**Import Order:**

1. Type imports
2. React/React Native
3. Next.js
4. Third-party modules
5. `@repo/*` packages
6. Local imports (`~/`, `@/`, relative)

### Spell Checking (CSpell)

- **Config:** `@repo/cspell-config`
- **Dictionaries:** bash, npm, redis
- Custom words in `tooling/cspell/index.js`

**Running:**

```bash
pnpm check:spelling
```

## Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feat/` - New features (e.g., `feat/new-theme-toggle`)
- `fix/` - Bug fixes (e.g., `fix/docs-typo`)
- `docs/` - Documentation changes
- `chore/` - Maintenance tasks
- `refactor/` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, no code change
- `refactor` - Code restructuring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `chore` - Maintenance tasks

**Examples:**

```
feat(style): add dark mode toggle
fix(api): correct theme injection for Safari
docs: update installation guide
chore: bump dependencies
```

Commits are validated with `commitlint` (configured in `commitlint.config.ts`) using lefthook git hooks.

### Pull Requests

- Keep PRs focused on a single concern
- Ensure all CI checks pass (lint, format, typecheck, spelling)
- Reference related issues
- Rebase on `main` when requested

## Changesets (Version Management)

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

### Creating a Changeset

When you make changes that should be in the next release:

```bash
pnpm changeset
```

This interactive prompt will:

1. Ask which packages are affected
2. Ask the type of change (major, minor, patch)
3. Ask for a summary of your changes
4. Create a markdown file in `.changeset/`

### Change Types

| Type      | When to Use                                            |
| --------- | ------------------------------------------------------ |
| **Major** | Breaking API changes, major feature rewrites           |
| **Minor** | New features, new components, significant improvements |
| **Patch** | Bug fixes, small improvements, documentation updates   |

### Releasing

Releases are automated via GitHub Actions on push to `dev`:

1. Changesets action creates a "Version Packages" PR
2. Merging that PR triggers the release
3. Style assets are uploaded to GitHub Releases

**Manual version bump (if needed):**

```bash
pnpm run version    # Updates versions based on changesets
pnpm run release    # Builds and publishes
```

### Configuration

Changeset config in `.changeset/config.json`:

- **Base branch:** `dev`
- **Access:** restricted (private packages)
- **Private packages:** versioned and tagged

## CI/CD Pipeline

### Continuous Integration (`.github/workflows/ci.yml`)

Runs on all PRs and pushes to `main`/`dev`:

| Job         | Description                                             |
| ----------- | ------------------------------------------------------- |
| `lint`      | Runs `pnpm lint` and `pnpm lint:ws` (workspace linting) |
| `format`    | Runs `pnpm format`                                      |
| `cspell`    | Runs `pnpm check:spelling`                              |
| `typecheck` | Runs `pnpm typecheck`                                   |

### Release Pipeline (`.github/workflows/release.yml`)

Runs on push to `dev`:

1. Builds all apps
2. Creates/updates "Version Packages" PR via changesets/action
3. On publish, uploads style dist to GitHub Releases

## Core Scripts

| Script                | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `pnpm dev`            | Turbo watch mode for all `dev` targets                |
| `pnpm dev:web`        | Focus on docs app only                                |
| `pnpm dev:api`        | Focus on API app only                                 |
| `pnpm dev:style`      | Focus on style app only                               |
| `pnpm build`          | Run every `build` pipeline                            |
| `pnpm typecheck`      | TypeScript across the repo                            |
| `pnpm format`         | Prettier check with shared config                     |
| `pnpm format:fix`     | Prettier fix with shared config                       |
| `pnpm lint`           | ESLint across apps + packages                         |
| `pnpm lint:fix`       | ESLint fix across apps + packages                     |
| `pnpm lint:ws`        | Validate workspace dependencies (sherif)              |
| `pnpm check:spelling` | CSpell spelling checks                                |
| `pnpm ui-add`         | Add shadcn/ui components to `@repo/ui`                |
| `pnpm turbo gen init` | Scaffold a new package/workspace with lint/type/build |
| `pnpm db:push`        | Push database schema changes                          |
| `pnpm db:studio`      | Open Drizzle Studio                                   |
| `pnpm changeset`      | Create a changeset for version management             |
| `pnpm version`        | Update package versions based on changesets           |
| `pnpm release`        | Build and publish release                             |

## Turborepo Configuration

### Task Dependencies (`turbo.json`)

| Task             | Depends On        | Outputs                              |
| ---------------- | ----------------- | ------------------------------------ |
| `build`          | `^build`          | `.cache/tsbuildinfo.json`, `dist/**` |
| `dev`            | `^dev`            | (no cache)                           |
| `lint`           | `^topo`, `^build` | `.cache/.eslintcache`                |
| `typecheck`      | `^topo`, `^build` | `.cache/tsbuildinfo.json`            |
| `format`         | -                 | `.cache/.prettiercache`              |
| `check:spelling` | `^topo`, `^build` | `.cache/.cspellcache`                |

### Global Environment Variables

**Required in `.env`:**

- `POSTGRES_URL`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_DOCS_URL`
- `PORT`

**Pass-through (set by environment):**

- `NODE_ENV`, `CI`, `VERCEL`, `VERCEL_ENV`, `VERCEL_URL`
- `NEXT_RUNTIME`, `NITRO_PRESET`, `NITRO_PRESET_CLOUD`

## Common Tasks

### Adding a New UI Component

```bash
pnpm ui-add
# Select components interactively
```

### Scaffolding a New Package

```bash
pnpm turbo gen init
# Enter package name, creates in packages/
# Move to tooling/ if it's a tooling package
```

### Database Schema Changes

```bash
# Edit packages/db/src/schema.ts
pnpm db:push     # Push changes to database
pnpm db:studio   # View in Drizzle Studio
```

### Updating Dependencies

```bash
pnpm update --interactive
pnpm lint:ws     # Validate workspace dependencies
```

### Cleaning Build Artifacts

```bash
pnpm clean              # Clean root node_modules
pnpm clean:workspaces   # Clean all workspace artifacts
```

## File Patterns

### What to Edit

- **Style changes:** `apps/style/src/**/*.scss`
- **API routes:** `apps/api/src/routes/**/*.ts`
- **Documentation:** `apps/docs/content/**/*.mdx`
- **UI components:** `packages/ui/src/**/*.tsx`
- **Database schema:** `packages/db/src/schema.ts`
- **Validators:** `packages/validators/src/**/*.ts`

### What Not to Edit Manually

- `pnpm-lock.yaml` - Auto-generated
- `apps/docs/.source/` - Auto-generated by fumadocs-mdx
- `**/dist/` - Build outputs
- `**/.next/` - Next.js build cache
- `**/.nitro/` - Nitro build cache
- `**/.turbo/` - Turborepo cache

## Environment Variables

### Required for Full Functionality

```env
POSTGRES_URL="postgresql://..."    # Database connection
OPENAI_API_KEY="sk-proj-..."       # AI features in docs
```

### Development URLs

```env
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_DOCS_URL="http://localhost:3000"
```

### Production URLs

```env
NEXT_PUBLIC_API_URL="https://coolify-tweaks-api.techwithanirudh.com"
NEXT_PUBLIC_DOCS_URL="https://coolify-tweaks.techwithanirudh.com"
```

## Troubleshooting

### ESLint errors after updating config

Clear ESLint cache and restart your editor:

```bash
rm -rf .cache/eslint
```

### Prettier not formatting correctly

Ensure the package extends `@repo/prettier-config`:

```json
{
  "prettier": "@repo/prettier-config"
}
```

### TypeScript errors after tsconfig changes

Clear TypeScript build info:

```bash
find . -name "tsconfig.tsbuildinfo" -delete
find . -name ".cache" -type d -exec rm -rf {} +
```

### Tailwind classes not working

Verify the theme is imported in your CSS entry point:

```css
@import "@repo/tailwind-config/theme";
```

And that PostCSS config is set up correctly.

## Issue and Discussion Templates

### Bug Reports

Use the bug report template which requires:

- Environment information (versions, installation method)
- Bug description
- Reproduction link
- Steps to reproduce

### Feature Requests

Open a discussion in the "Ideas" category with:

- Feature description and context
- Proposed solution
- Additional information

## Getting Help

1. Check the [documentation](https://coolify-tweaks.techwithanirudh.com/docs/development)
2. Open a [discussion](https://github.com/techwithanirudh/coolify-tweaks/discussions)
3. Open a draft PR with what you tried and any error output

## Summary Checklist for Contributors

- [ ] System requirements met (Node.js 24+, PNPM 10+, Bun 1.3+)
- [ ] Repository cloned and dependencies installed
- [ ] `.env` configured from `.env.example`
- [ ] Development server running (`pnpm dev`)
- [ ] Changes pass all checks:
  - [ ] `pnpm lint`
  - [ ] `pnpm format`
  - [ ] `pnpm typecheck`
  - [ ] `pnpm check:spelling`
- [ ] Changeset created for user-facing changes (`pnpm changeset`)
- [ ] Commit messages follow Conventional Commits
- [ ] PR is focused and all CI checks pass
