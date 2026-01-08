import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const eventTypeEnum = pgEnum("event_type", ["install", "update"]);

export const sessions = pgTable("sessions", (t) => ({
  id: t.text().notNull().primaryKey(),
  firstSeenAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  lastSeenAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
}));

export const events = pgTable("events", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  sessionId: t.text().references(() => sessions.id),
  eventType: eventTypeEnum().notNull(),
  asset: t.text().notNull(),
  theme: t.text(),
  tag: t.text().notNull(),
  // HTTP status code of the response
  statusCode: t.integer().notNull(),
  createdAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  ipHash: t.text(),
}));

export const InsertSessionSchema = createInsertSchema(sessions).omit({
  firstSeenAt: true,
  lastSeenAt: true,
});

export const InsertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});
