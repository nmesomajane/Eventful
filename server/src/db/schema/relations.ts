import { relations } from "drizzle-orm";
import { tickets } from "./tickets";
import { events } from "./events";
import { users } from "./users";
import { reminders } from "./reminders";

export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, { fields: [tickets.eventId], references: [events.id] }),
  attendee: one(users, { fields: [tickets.attendeeId], references: [users.id] }),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  ticket: one(tickets, { fields: [reminders.ticketId], references: [tickets.id] }),
  event: one(events, { fields: [reminders.eventId], references: [events.id] }),
}));