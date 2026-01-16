import { init } from "@paralleldrive/cuid2";
import { eq, or } from "drizzle-orm";
import { z } from "zod/v4";

import { db } from "./client";
import { events, sessions } from "./schema";

const createId = init({ length: 6 });

export const trackSessionInputSchema = z.object({
  ipHash: z.string().nullable(),
  sessionId: z.string().nullable(),
  asset: z.string(),
  theme: z.string().nullable(),
  tag: z.string(),
  statusCode: z.number(),
});

export const trackSessionResultSchema = z.object({
  sessionId: z.string().nullable(),
  isNewSession: z.boolean(),
});

export type TrackSessionInput = z.infer<typeof trackSessionInputSchema>;
export type TrackSessionResult = z.infer<typeof trackSessionResultSchema>;

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
    .where(
      or(eq(sessions.firstIpHash, ipHash), eq(sessions.lastIpHash, ipHash)),
    )
    .limit(1);
  return found ?? null;
}

type EventType = "install" | "update";

async function writeEvent(
  sessionId: string,
  eventType: EventType,
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

export async function trackSession(
  input: TrackSessionInput,
): Promise<TrackSessionResult> {
  const { ipHash, sessionId, asset, theme, tag, statusCode } = input;

  try {
    if (sessionId) {
      const existing = await findBySessionId(sessionId);
      if (existing) {
        await db
          .update(sessions)
          .set({
            lastSeenAt: new Date(),
            ...(ipHash ? { lastIpHash: ipHash } : {}),
          })
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

      await createSession(sessionId, asset, ipHash);

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
    await createSession(newId, asset, ipHash);

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

async function createSession(id: string, asset: string, ipHash: string | null) {
  await db.insert(sessions).values({
    id,
    asset,
    ...(ipHash ? { firstIpHash: ipHash, lastIpHash: ipHash } : {}),
  });
}
