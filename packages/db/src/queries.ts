import { db } from "./client";
import { events } from "./schema";

export interface LogPayload {
  asset: string;
  theme: string | null;
  tag: string;
  statusCode: number;
  ipHash: string | null;
  referer: string | null;
}

export async function logRequest(payload: LogPayload): Promise<void> {
  try {
    await db.insert(events).values(payload);
  } catch (error) {
    console.error("[analytics] Failed to log event:", error);
  }
}
