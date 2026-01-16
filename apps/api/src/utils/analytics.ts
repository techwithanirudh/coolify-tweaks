import { createHash } from "node:crypto";

const CUID_PATTERN = /^[a-z0-9]{6}$/;

export function isValidId(id: unknown): id is string {
  return typeof id === "string" && CUID_PATTERN.test(id);
}

export function hashIp(
  ip: string | null | undefined,
  salt: string | undefined,
): string | null {
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
