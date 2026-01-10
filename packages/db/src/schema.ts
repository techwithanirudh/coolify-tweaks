import { index, pgTable } from "drizzle-orm/pg-core";

export const events = pgTable(
  "events",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
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
  ],
);
