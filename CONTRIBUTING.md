# Contributing

> [!NOTE]
>
> Make sure to follow the system requirements specified in [`package.json#engines`](./package.json#L4) before proceeding.

You can install for development by using Turbo's CLI to init your project (use PNPM as package manager):

```bash
npx create-turbo@latest -e https://github.com/techwithanirudh/coolify-tweaks
```

## About

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
  ├─ web
  │   ├─ Next.js 16 website
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
```

> In this template, we use `@repo` for package names.

## Apps

- **Style** (`apps/style`, port 3000): SASS/Tailwind build watcher that outputs the Coolify theme; run with `pnpm --filter @repo/style dev`.
- **API** (`apps/api`, port 3001): lightweight Nitro proxy that serves GitHub assets and health checks; run with `pnpm --filter @repo/api dev`.
- **Website** (`apps/web`, port 3002): full-stack web UI with shared packages; run with `pnpm --filter @repo/nextjs dev`.

## Quick Start

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```

### 2a. When it's time to add a new UI component

Run the `ui-add` script to add a new UI component using the interactive `shadcn/ui` CLI:

```bash
pnpm ui-add
```

When the component(s) has been installed, you should be good to go and start using it in your app.

### 2b. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.
 
## Deployment

### Next.js

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com). If you've never deployed a Turborepo app there, don't worry, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/web` folder as the root directory. Vercel's zero-config system should handle all configurations for you.

2. Add your `POSTGRES_URL` environment variable.

3. Done! Your app should successfully deploy.

### Style

#### Development
Run the watcher while you iterate on Sass sources:

```bash
pnpm --filter @repo/style dev
```

#### Distribution
The stylesheet is produced with Sass, Lightning CSS, and PostCSS. Build the bundle, then publish the generated `dist/main.user.css` via a GitHub release (or let Changesets handle it):

```bash
pnpm --filter @repo/style build
```

### API

The API is a Nitro server that proxies release assets, handles analytics and diagnostics.

#### Deploy to Vercel

1. Create a new Vercel project and set the root directory to `apps/api`.

2. Vercel automatically detects the Nitro preset; no extra build settings are required.

2. Add your `POSTGRES_URL` environment variable.

3. Done! Your app should successfully deploy.

Once deployed, the API will continuously serve the latest release artifacts without additional configuration.

## References

The stack originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
