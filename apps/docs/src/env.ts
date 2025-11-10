import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
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
        (process.env.NODE_ENV !== "production" ? "http://localhost:3001" : val),
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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
});
