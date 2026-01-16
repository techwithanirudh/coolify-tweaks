import { init } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

import { db } from "./client";
import { events, sessions } from "./schema";

const createId = init({ length: 8 });

export interface TrackSessionInput {
  id: string | null;
  asset: string;
  theme: string | null;
  tag: string;
  statusCode: number;
  ipHash: string | null;
  referer: string | null;
}

export interface TrackSessionResult {
  sessionId: string;
  isNewSession: boolean;
}

export async function trackSession(
  input: TrackSessionInput,
): Promise<TrackSessionResult> {
  const { id, asset, theme, tag, statusCode, ipHash, referer } = input;

  const isNewSession = !id;
  const sessionId = id ?? createId();
  const eventType = isNewSession ? "install" : "update";

  try {
    if (isNewSession) {
      await db.insert(sessions).values({
        id: sessionId,
        asset,
        firstIpHash: ipHash,
        lastIpHash: ipHash,
      });
    } else {
      await db
        .update(sessions)
        .set({ lastSeenAt: new Date(), lastIpHash: ipHash })
        .where(eq(sessions.id, sessionId));
    }

    await db.insert(events).values({
      sessionId,
      eventType,
      asset,
      theme,
      tag,
      statusCode,
      ipHash,
      referer,
    });
  } catch (error) {
    console.error("[analytics] Failed to track session:", error);
  }

  return { sessionId, isNewSession };
}
