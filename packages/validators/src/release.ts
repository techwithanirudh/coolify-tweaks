import { z } from "zod/v4";

export const themeIdSchema = z.string().regex(/^c[a-z0-9]{24}$/);

const optionalStringParam = (schema: z.ZodString) =>
  z
    .preprocess(
      (value) => (typeof value === "string" ? value : undefined),
      schema,
    )
    .optional();

export const releaseQuerySchema = z.object({
  asset: optionalStringParam(z.string()),
  theme: optionalStringParam(z.string()),
});
