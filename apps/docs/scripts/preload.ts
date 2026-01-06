import { plugin } from "bun";
import { createMdxPlugin } from "fumadocs-mdx/bun";
import { postInstall } from "fumadocs-mdx/next";

const configPath = "source.config.ts";
await postInstall({ configPath });
 
plugin(createMdxPlugin({ configPath }));
