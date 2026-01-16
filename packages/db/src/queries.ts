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

export async function trackSession(input: TrackSessionInput) {
  const { ipHash, sessionId, asset, theme, tag, statusCode } = input;

  try {
    const existing = await findSession(ipHash, sessionId);

    if (existing) {
      await db
        .update(sessions)
        .set({ lastSeenAt: new Date(), lastIpHash: ipHash })
        .where(eq(sessions.id, existing.id));

      await db.insert(events).values({
        sessionId: existing.id,
        eventType: "update",
        asset,
        theme,
        tag,
        statusCode,
        ipHash,
      });

      return { sessionId: existing.id, isNewSession: false };
    }

    const newId = createId();
    await db.insert(sessions).values({
      id: newId,
      asset,
      firstIpHash: ipHash,
      lastIpHash: ipHash,
    });

    await db.insert(events).values({
      sessionId: newId,
      eventType: "install",
      asset,
      theme,
      tag,
      statusCode,
      ipHash,
    });

    return { sessionId: newId, isNewSession: true };
  } catch (error) {
    console.error("[analytics] Failed to track session:", error);
    return { sessionId: createId(), isNewSession: true };
  }
}
