# Fumadocs Starter

This is a starter template for building documentation using [Fumadocs](https://fumadocs.vercel.app), integrated with OpenAPI and designed to work seamlessly with the Vercel AI SDK.

It is powered by [Next.js](https://nextjs.org) and was generated using [Create Fumadocs](https://github.com/fuma-nama/fumadocs).

## Prerequisites

* Node 22+
* A package manager
* Git
* Optional if you plan to use AI right away:
  * An OpenAI compatible API key for Vercel AI SDK

## 1) Install dependencies

Clone your repo and install packages with your preferred manager.


**bun**

```bash
bun install
```

**pnpm**

```bash
pnpm install
```

## 2) Environment variables

Create a `.env.local` in the project root.

If using Vercel AI SDK:

```bash
# Choose one provider, example for OpenAI compatible endpoints
OPENAI_API_KEY=sk-...
# Or for Azure/OpenRouter/etc, set the provider vars your app expects
```

If you are not enabling AI, just set a dummy value, like `sk-123`.

## 3) Development

Start the dev server:

**bun**

```bash
bun dev
```

**pnpm**

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 4) Build and preview

**Build**

```bash
bun run build
# or: pnpm run build
```

**Preview**

```bash
bun start
# or: pnpm start
```

## Optional features

* **MCP Server**: If you plan to extend workflows with MCP, install and configure your MCP server, then wire it in your app code or an API route as documented in your chosen server.

## What's Inside

* **Fumadocs** - Fast, flexible documentation powered by MDX.
* **OpenAPI** - OpenAPI support for API Documentation
* **AI SDK** - Supports the Vercel AI SDK for advanced AI chat features.
* **MCP-Ready** - Easily extend with an optional MCP Server for more advanced workflows.
* **Twoslash** - Embed live, type-checked code examples with rich editor features such as errors, completions, and hovers.

## Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Learn Next.js](https://nextjs.org/learn)
* [Fumadocs](https://fumadocs.vercel.app)
