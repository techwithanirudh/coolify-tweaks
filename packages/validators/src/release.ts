import { z } from "zod/v4";

export const themeIdSchema = z.string().regex(/^c[a-z0-9]{24}$/);

const optionalStringParam = (schema: z.ZodString) =>
  z
    .preprocess((value) => {
      if (typeof value !== "string") return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }, schema)
    .optional();

export const releaseQuerySchema = z.object({
  asset: optionalStringParam(z.string()),
  theme: optionalStringParam(z.string()),
});
