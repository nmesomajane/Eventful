import { relations } from "drizzle-orm";
import { tickets } from "./tickets";
import { events } from "./events";
import { users } from "./users";

export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, { fields: [tickets.eventId], references: [events.id] }),
  attendee: one(users, { fields: [tickets.attendeeId], references: [users.id] }),
}));