import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    OPENAI_API_KEY: z.string().startsWith('sk-'),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.preprocess(
      (val) =>
        val ??
        (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : val),
      z.url()
    ),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
})
