import { pgTable, uuid, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { events } from "./events";

export const reminderStatusEnum = pgEnum("reminder_status", ["pending", "sent", "cancelled"]);

export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  offsetMinutes: integer("offset_minutes").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: reminderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Reminder = typeof reminders.$inferSelect;