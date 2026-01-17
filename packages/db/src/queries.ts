import { init } from "@paralleldrive/cuid2";
import { desc, eq, or } from "drizzle-orm";
import { z } from "zod/v4";

import { db } from "./client";
import { events, sessions } from "./schema";

const createId = init({ length: 6 });

export const trackSessionInputSchema = z.object({
  ipHash: z.string().nullable(),
  asset: z.string(),
  theme: z.string().nullable(),
  tag: z.string(),
  statusCode: z.number(),
});

export type TrackSessionInput = z.infer<typeof trackSessionInputSchema>;

async function findByIp(ipHash: string) {
  const [found] = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(
      or(eq(sessions.firstIpHash, ipHash), eq(sessions.lastIpHash, ipHash)),
    )
    .orderBy(desc(sessions.lastSeenAt))
    .limit(1);
  return found ?? null;
}

type EventType = "install" | "update";

async function writeEvent(
  sessionId: string,
  eventType: EventType,
  input: TrackSessionInput,
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

async function createSession(
  id: string,
  asset: string,
  ipHash: string | null,
): Promise<void> {
  await db.insert(sessions).values({
    id,
    asset,
    ...(ipHash ? { firstIpHash: ipHash, lastIpHash: ipHash } : {}),
  });
}

export async function trackSession(
  input: TrackSessionInput,
): Promise<{ isNewSession: boolean }> {
  const { ipHash, asset, theme, tag, statusCode } = input;

  try {
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

        return { isNewSession: false };
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

    return { isNewSession: true };
  } catch (error) {
    console.error("[analytics] Failed to track session:", error);
    return { isNewSession: false };
  }
}
