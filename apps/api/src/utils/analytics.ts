import { createHash } from "node:crypto";

export function isValidId(id: unknown): id is string {
  if (typeof id !== "string") return false;
  return !/[^\w-]/.test(id) && id.length >= 8 && id.length <= 32;
}

export function hashIp(
  ip: string | null | undefined,
  salt: string | undefined,
): string | null {
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
