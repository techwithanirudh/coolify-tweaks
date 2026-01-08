import { eq } from "drizzle-orm";

import { db } from "./client";
import { events, sessions } from "./schema";

export type EventType = "install" | "update";

export interface LogPayload {
  sessionId: string;
  eventType: EventType;
  asset: string;
  theme: string | null;
  tag: string;
  statusCode: number;
  ipHash: string | null;
  isNewSession: boolean;
}

export async function logRequest(payload: LogPayload): Promise<void> {
  const {
    sessionId,
    eventType,
    asset,
    theme,
    tag,
    statusCode,
    ipHash,
    isNewSession,
  } = payload;

  try {
    if (isNewSession) {
      await db.insert(sessions).values({ id: sessionId });
    } else {
      await db
        .update(sessions)
        .set({ lastSeenAt: new Date() })
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
    });
  } catch (error) {
    console.error("[analytics] Failed to log event:", error);
  }
}
