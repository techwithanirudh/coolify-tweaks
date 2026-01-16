import { z } from "zod/v4";

export const sessionIdSchema = z.string().regex(/^[a-z0-9]{6}$/);
export const themeIdSchema = z.string().regex(/^c[a-z0-9]{24}$/);
export const notrackSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    if (value === "1" || value === "true") return true;
    if (value === "0" || value === "false") return false;
  }
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === "boolean") return value;
  return undefined;
}, z.boolean());

export const isValidSessionId = (value: unknown): value is string =>
  sessionIdSchema.safeParse(value).success;

const optionalStringParam = (schema: z.ZodString) =>
  z
    .preprocess(
      (value) => (typeof value === "string" ? value : undefined),
      schema,
    )
    .optional()
    .catch(undefined);

const optionalParam = (schema: z.ZodTypeAny) =>
  z
    .preprocess((value) => value, schema)
    .optional()
    .catch(undefined);

export const releaseQuerySchema = z.object({
  asset: optionalStringParam(z.string()),
  theme: optionalStringParam(themeIdSchema),
  id: optionalStringParam(sessionIdSchema),
  notrack: optionalParam(notrackSchema),
});
