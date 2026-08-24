import { pgTable, uuid, varchar, decimal, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { events } from "./events";

export const ticketStatusEnum = pgEnum("ticket_status", ["pending", "paid", "failed", "cancelled"]);

export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  attendeeId: uuid("attendee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: ticketStatusEnum("status").notNull().default("pending"),
  paystackReference: varchar("paystack_reference", { length: 255 }).notNull().unique(),
  qrCode: varchar("qr_code", { length: 255 }).unique(), // set once paid
  isScanned: boolean("is_scanned").notNull().default(false),
  scannedAt: timestamp("scanned_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;