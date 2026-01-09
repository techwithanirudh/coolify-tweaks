import { pgTable } from "drizzle-orm/pg-core";

export const events = pgTable("events", (t) => ({
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
}));
