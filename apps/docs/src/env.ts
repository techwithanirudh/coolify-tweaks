import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NEXT_RUNTIME: z.enum(["nodejs", "edge"]).default("nodejs"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    OPENAI_API_KEY: z.string().startsWith("sk-"),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.preprocess(
      (val) =>
        val ??
        (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : val),
      z.url(),
    ),
    NEXT_PUBLIC_DOCS_URL: z.preprocess(
      (val) =>
        val ??
        (process.env.NODE_ENV !== "production" ? "http://localhost:3002" : val),
      z.url(),
    ),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
  },
});
