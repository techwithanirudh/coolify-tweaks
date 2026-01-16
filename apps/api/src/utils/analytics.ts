import { createHash } from "node:crypto";

export function hashIp(
  ip: string | null | undefined,
  salt: string | undefined,
): string | null {
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
