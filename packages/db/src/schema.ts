import { index, pgEnum, pgTable } from "drizzle-orm/pg-core";

export const eventTypeEnum = pgEnum("event_type", ["install", "update"]);

export const sessions = pgTable(
  "sessions",
  (t) => ({
    id: t.text().notNull().primaryKey(),
    asset: t.text().notNull(),
    firstIpHash: t.text(),
    lastIpHash: t.text(),
    firstSeenAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    lastSeenAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  }),
  (table) => [
    index("sessions_first_ip_idx").on(table.firstIpHash),
    index("sessions_last_ip_idx").on(table.lastIpHash),
  ],
);

export const events = pgTable(
  "events",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    sessionId: t.text().references(() => sessions.id),
    eventType: eventTypeEnum().notNull(),
    asset: t.text().notNull(),
    theme: t.text(),
    tag: t.text().notNull(),
    statusCode: t.integer().notNull(),
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    ipHash: t.text(),
    referer: t.text(),
  }),
  (table) => [
    index("events_created_at_idx").on(table.createdAt),
    index("events_asset_idx").on(table.asset),
    index("events_ip_hash_idx").on(table.ipHash),
    index("events_tag_idx").on(table.tag),
    index("events_session_id_idx").on(table.sessionId),
  ],
);
