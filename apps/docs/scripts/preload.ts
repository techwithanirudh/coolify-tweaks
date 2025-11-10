import { createMdxPlugin } from "fumadocs-mdx/bun";
import { postInstall } from "fumadocs-mdx/next";

const configPath = "source.script.ts";
// eslint-disable @typescript-eslint/no-floating-promises -- Top-level await in Bun plugin
await postInstall(configPath);
// eslint-enable @typescript-eslint/no-floating-promises -- Top-level await in Bun plugin
Bun.plugin(createMdxPlugin({ configPath }));
