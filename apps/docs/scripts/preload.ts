import { createMdxPlugin } from "fumadocs-mdx/bun";
import { postInstall } from "fumadocs-mdx/next";

const configPath = "source.script.ts";
// eslint-disable-next-line @typescript-eslint/no-floating-promises -- Top-level await in Bun plugin
await postInstall(configPath);
Bun.plugin(createMdxPlugin({ configPath }));
