import { init } from "@paralleldrive/cuid2";
import { eq, or } from "drizzle-orm";

import { db } from "./client";
import { events, sessions } from "./schema";

const createId = init({ length: 6 });

export interface TrackSessionInput {
  ipHash: string | null;
  sessionId: string | null;
  asset: string;
  theme: string | null;
  tag: string;
  statusCode: number;
}

async function findSession(ipHash: string | null, sessionId: string | null) {
  if (sessionId) {
    const [found] = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);
    if (found) return found;
  }

  if (ipHash) {
    const [found] = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(
        or(eq(sessions.firstIpHash, ipHash), eq(sessions.lastIpHash, ipHash)),
      )
      .limit(1);
    if (found) return found;
  }

  return null;
}

async function writeEvent(
  sessionId: string,
  eventType: "install" | "update",
  input: Omit<TrackSessionInput, "sessionId">,
) {
  await db.insert(events).values({
    sessionId,
    eventType,
    asset: input.asset,
    theme: input.theme,
    tag: input.tag,
    statusCode: input.statusCode,
    ipHash: input.ipHash,
  });
}

export async function trackSession(input: TrackSessionInput) {
  const { ipHash, sessionId } = input;

  try {
    const existing = await findSession(ipHash, sessionId);

    if (existing) {
      const updates = {
        lastSeenAt: new Date(),
        ...(ipHash ? { lastIpHash: ipHash } : {}),
      };
      await db
        .update(sessions)
        .set(updates)
        .where(eq(sessions.id, existing.id));

      await writeEvent(existing.id, "update", {
        ipHash,
        asset: input.asset,
        theme: input.theme,
        tag: input.tag,
        statusCode: input.statusCode,
      });

      return { sessionId: existing.id, isNewSession: false };
    }

    const newId = sessionId || createId();
    await db.insert(sessions).values({
      id: newId,
      asset: input.asset,
      ...(ipHash ? { firstIpHash: ipHash, lastIpHash: ipHash } : {}),
    });

    await writeEvent(newId, "install", {
      ipHash,
      asset: input.asset,
      theme: input.theme,
      tag: input.tag,
      statusCode: input.statusCode,
    });

    return { sessionId: newId, isNewSession: true };
  } catch (error) {
    console.error("[analytics] Failed to track session:", error);
    return { sessionId: sessionId || createId(), isNewSession: true };
  }
}
