# AGENTS.md

Coolify Tweaks is a userstyle that enhances Coolify's UI. Built as a Turborepo monorepo with all internal packages scoped under `@repo/*`.

## Repository Structure

```
apps/
├── api/         # @repo/api - Nitro server for dynamic style builds (port 8080)
├── docs/        # @repo/docs - Next.js 16 + Fumadocs documentation site (port 3000)
└── style/       # @repo/style - Sass + PostCSS + LightningCSS pipeline
packages/
├── db/          # @repo/db - Drizzle ORM for PostgreSQL/Neon
├── ui/          # @repo/ui - Shared React components (shadcn/ui)
└── validators/  # @repo/validators - Zod validation schemas
tooling/         # Shared configs (@repo/eslint-config, @repo/prettier-config, @repo/tsconfig, etc.)
```

## Quick Start

```bash
pnpm install
cp .env.example .env  # Configure POSTGRES_URL, OPENAI_API_KEY, NEXT_PUBLIC_API_URL, etc.
pnpm dev              # Run all apps
```

## Key Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `pnpm dev`            | Run all apps in watch mode               |
| `pnpm dev:style`      | Style app only                           |
| `pnpm dev:api`        | API server only                          |
| `pnpm dev:web`        | Docs site only                           |
| `pnpm build`          | Build all apps                           |
| `pnpm lint`           | ESLint (`lint:fix` to fix)               |
| `pnpm lint:ws`        | Validate workspace dependencies (sherif) |
| `pnpm format`         | Prettier check (`format:fix` to fix)     |
| `pnpm typecheck`      | TypeScript check                         |
| `pnpm check:spelling` | CSpell                                   |
| `pnpm db:push`        | Push database schema changes             |
| `pnpm db:studio`      | Open Drizzle Studio                      |
| `pnpm ui-add`         | Add shadcn/ui components to `@repo/ui`   |
| `pnpm changeset`      | Create a changeset for versioning        |
| `pnpm version`        | Apply version bumps from changesets      |

Filter syntax: `pnpm --filter @repo/style dev`

## Style App (`apps/style/`)

Sass + PostCSS + LightningCSS pipeline that produces the Coolify theme.

Entry: `src/main.scss` → Output: `dist/`

```
src/
├── components/    # Component styling (sidebar, cards, navbar, etc.)
├── pages/         # Page-specific tweaks (deployments, resources, onboarding)
├── theme/         # Variables, base reset, typography
├── utilities/     # Misc helpers and overrides
├── _globals.scss
├── _mixins.scss
└── main.scss      # Entry point that imports everything
plugins/postcss/   # Custom PostCSS plugins (banner, theme identifier, moz wrapping)
scripts/           # Build and watch helpers
```

**Outputs:**
- `dist/main.user.css` - Stylus-friendly with userstyle metadata
- `dist/main.css` - Raw CSS bundle for Traefik dynamic-config install

**Local workflow:**
1. Start watcher: `pnpm dev:style`
2. Start API: `pnpm dev:api`
3. Install in Stylus from `http://localhost:8080/release/latest/?asset=main.user.css`
4. Edit Sass partials - changes reflect immediately

## API App (`apps/api/`)

Nitro server serving dynamic style builds with TweakCN theme injection. In dev mode, reads CSS directly from the style app's `dist/` folder for instant feedback.

```
src/
├── routes/
│   ├── index.ts              # Root route
│   ├── health/index.ts       # Health check
│   └── release/[tag]/index.ts  # Release proxy
├── middleware/cors.ts        # CORS configuration
├── utils/
│   ├── css-compiler.ts       # transformCss() - Lightning CSS transforms
│   ├── css-transformer.ts    # cssVarsToCss() - variable conversion
│   └── themes.ts             # getThemeCss(), processContent()
└── config.ts                 # App configuration
```

**Routes:**
- `GET /release/latest/?asset=main.css` - Latest CSS bundle
- `GET /release/[tag]/[asset]` - Specific release assets
- `GET /health` - Health check

**Theme Injection:**

The Style app's PostCSS plugin injects markers around CSS variables:

```css
/* ==UI-THEME-VARS:START== */
:root { --background: #fdfdfd; ... }
.dark { --background: #1f1c23; ... }
/* ==UI-THEME-VARS:END== */
```

Request with `?theme=<theme-id>` to apply a TweakCN theme:
1. Fetches base CSS from GitHub releases
2. Fetches theme data from TweakCN using theme ID
3. Converts theme CSS variables using `cssVarsToCss()`
4. Transforms CSS using Lightning CSS for browser compatibility
5. Replaces content between `UI-THEME-VARS` markers
6. Updates `updateURL` in userstyle metadata to preserve theme parameter

**Analytics:**
- Tracks anonymous usage (installs vs updates)
- Session matching: Session ID first, then hashed IP (SHA256 + salt) fallback
- Data stored: hashed IP, session ID, asset, theme, tag
- Opt-out with `?notrack=1`
- Implementation: `trackSession()` in `@repo/db/queries`, schema in `@repo/db/schema`

## Docs App (`apps/docs/`)

```
content/docs/      # MDX documentation files
scripts/           # generate-docs, sync-changelog, lint helpers
src/app/
├── (home)/        # Marketing homepage
├── docs/          # Fumadocs routes
├── api/           # Next API routes (chat, search)
└── og/            # OG image generation
```

**Pre-build scripts:** `pnpm --filter @repo/docs run build:pre` (generates OpenAPI docs, syncs changelog)

## Database (`packages/db/`)

- Schema: `packages/db/src/schema.ts`
- Exports: `@repo/db`, `@repo/db/client`, `@repo/db/schema`

## Git Workflow

**Branch naming:**
- `feat/` - New features (e.g., `feat/new-theme-toggle`)
- `fix/` - Bug fixes (e.g., `fix/docs-typo`)
- `docs/` - Documentation changes
- `chore/` - Maintenance tasks
- `refactor/` - Code refactoring

**Commit messages** (Conventional Commits, validated by commitlint):

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
```
feat(style): add dark mode toggle
fix(api): correct theme injection for Safari
docs: update installation guide
```

## CI/CD

**CI (`.github/workflows/ci.yml`)** - Runs on PRs and pushes to `main`/`dev`:
- `lint` - `pnpm lint` and `pnpm lint:ws` (workspace linting)
- `format` - `pnpm format`
- `cspell` - `pnpm check:spelling`
- `typecheck` - `pnpm typecheck`

**Release (`.github/workflows/release.yml`)** - Runs on push to `dev`:
1. Builds all apps
2. Creates/updates "Version Packages" PR via changesets/action
3. On publish, uploads style dist to GitHub Releases

## Releases

When requested to make a release:

1. Gather git commits since the last release tag
2. Run `pnpm changeset --empty`
3. Update the empty changeset with release content (keep it simple and clear)
4. Run `pnpm version` to apply the version bump
5. Ask user to review, then commit

## Project-Specific Rules

- Use `@/env` import for environment variables (no direct `process.env`)
- Unused variables must be prefixed with `_`
- Use type imports: `import type { Foo } from 'bar'`
- Run `pnpm lint && pnpm format && pnpm typecheck && pnpm check:spelling` before pushing
