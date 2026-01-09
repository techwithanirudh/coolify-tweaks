# Coolify Tweaks Style

This package compiles the Coolify Tweaks userstyle using SASS, Lightning CSS, and PostCSS. The output lives in `dist/` and is published via Changesets.

## Scripts

All commands are invoked from the repo root with PNPM filters:

```bash
# Install dependencies (once per repo)
pnpm install

# Watch mode: rebuild on change
pnpm --filter @repo/style dev

# One-off build
pnpm --filter @repo/style build

# Lint, type-check, spell-check
pnpm --filter @repo/style lint
pnpm --filter @repo/style typecheck
pnpm --filter @repo/style check:spelling
```

## Distribution

Running the build script generates:

- `dist/main.user.css`
- `dist/main.user.css.map`

These artifacts are attached to GitHub releases automatically when the Changesets workflow publishes. You can also run the build locally and upload `main.user.css` manually if needed.

## Project Structure

```text
apps/style
├── scripts          # build/watch orchestration
├── src              # Sass entrypoints broken into components/pages/theme
├── postcss.config.js
├── tsconfig.json
└── package.json
```

The Sass entry file is `src/main.scss`. Individual components live under `src/components`, while `src/theme` contains token definitions and CSS variables.

## Development Workflow

While `pnpm --filter @repo/style dev` is running, the watcher automatically rebuilds the CSS when you edit Sass files. The API server (`pnpm --filter @repo/api dev`) reads the built CSS directly from `dist/` in development mode, so changes are reflected immediately.

To test locally:
1. Start the style watcher: `pnpm --filter @repo/style dev`
2. Start the API server: `pnpm --filter @repo/api dev`
3. Load the CSS from `http://localhost:8080/release/latest` in Stylus

## Releasing

1. Create a Changeset describing the update.
2. Merge to `dev`; CI will run and publish when you trigger the release workflow.
3. Once published, the API app serves the new CSS from GitHub releases.
