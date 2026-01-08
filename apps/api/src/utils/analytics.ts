import { createHash } from "node:crypto";
import type { H3Event } from "nitro/h3";
import { nanoid } from "nanoid";

const TRK_PATTERN = /^[\w-]{8,32}$/;

export function isValidTrk(trk: unknown): trk is string {
  return typeof trk === "string" && TRK_PATTERN.test(trk);
}

export function mintTrk(): string {
  return nanoid(16);
}

export function getClientIp(event: H3Event): string | null {
  const req = event.node?.req;
  if (!req) return null;

  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const firstIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
      ?.split(",")[0]
      ?.trim();
    if (firstIp) return firstIp;
  }

  return req.socket.remoteAddress ?? null;
}

export function hashIp(
  ip: string | null,
  salt: string | undefined,
): string | null {
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
