import { pgTable, uuid, varchar, text, integer, decimal, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const eventStatusEnum = pgEnum("event_status", ["draft", "published", "cancelled", "completed"]);

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizerId: uuid("organizer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  location: varchar("location", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  capacity: integer("capacity").notNull(),
  ticketPrice: decimal("ticket_price", { precision: 10, scale: 2 }).notNull().default("0"),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  status: eventStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;