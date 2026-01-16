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

async function findBySessionId(sessionId: string) {
  const [found] = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);
  return found ?? null;
}

async function findByIp(ipHash: string) {
  const [found] = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(or(eq(sessions.firstIpHash, ipHash), eq(sessions.lastIpHash, ipHash)))
    .limit(1);
  return found ?? null;
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
  const { ipHash, sessionId, asset, theme, tag, statusCode } = input;

  try {
    if (sessionId) {
      const existing = await findBySessionId(sessionId);
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
          asset,
          theme,
          tag,
          statusCode,
        });

        return { sessionId: existing.id, isNewSession: false };
      }

      await db.insert(sessions).values({
        id: sessionId,
        asset,
        ...(ipHash ? { firstIpHash: ipHash, lastIpHash: ipHash } : {}),
      });

      await writeEvent(sessionId, "install", {
        ipHash,
        asset,
        theme,
        tag,
        statusCode,
      });

      return { sessionId, isNewSession: true };
    }

    if (ipHash) {
      const existing = await findByIp(ipHash);
      if (existing) {
        await db
          .update(sessions)
          .set({ lastSeenAt: new Date(), lastIpHash: ipHash })
          .where(eq(sessions.id, existing.id));

        await writeEvent(existing.id, "update", {
          ipHash,
          asset,
          theme,
          tag,
          statusCode,
        });

        return { sessionId: existing.id, isNewSession: false };
      }
    }

    const newId = createId();
    await db.insert(sessions).values({
      id: newId,
      asset,
      ...(ipHash ? { firstIpHash: ipHash, lastIpHash: ipHash } : {}),
    });

    await writeEvent(newId, "install", {
      ipHash,
      asset,
      theme,
      tag,
      statusCode,
    });

    return { sessionId: newId, isNewSession: true };
  } catch (error) {
    console.error("[analytics] Failed to track session:", error);
    return { sessionId: null, isNewSession: false };
  }
}
