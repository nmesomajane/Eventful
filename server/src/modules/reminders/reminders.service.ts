import { eq, and, lte } from "drizzle-orm";
import { db } from "../../config/db";
import { reminders, tickets, events, users } from "../../db/schema";
import { sendEmail } from "../../utils/email";
import { AppError } from "../../utils/AppError";

const MINUTE_MS = 60 * 1000;

export async function generateRemindersForTicket(ticketId: string) {
  console.log("[reminders.service] generating reminders for ticket:", ticketId);

  const ticket = await db.query.tickets.findFirst({ where: eq(tickets.id, ticketId) });
  if (!ticket) throw new AppError(404, "Ticket not found");

  const event = await db.query.events.findFirst({ where: eq(events.id, ticket.eventId) });
  if (!event) throw new AppError(404, "Event not found");

  // Clear old pending reminders before regenerating (handles re-customization)
  await db.delete(reminders).where(and(eq(reminders.ticketId, ticketId), eq(reminders.status, "pending")));

  const offsets = ticket.customReminderOffsets?.length ? ticket.customReminderOffsets : event.reminderOffsets;

  const rows = offsets
    .map((offsetMinutes) => {
      const scheduledFor = new Date(event.startDate.getTime() - offsetMinutes * MINUTE_MS);
      if (scheduledFor <= new Date()) {
        console.log("[reminders.service] skipping past-due offset:", offsetMinutes);
        return null;
      }
      return { ticketId, eventId: event.id, offsetMinutes, scheduledFor, status: "pending" as const };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length === 0) {
    console.log("[reminders.service] no future reminders to schedule for ticket:", ticketId);
    return [];
  }

  const created = await db.insert(reminders).values(rows).returning();
  console.log("[reminders.service] scheduled", created.length, "reminder(s) for ticket:", ticketId);
  return created;
}

export async function updateTicketReminders(ticketId: string, attendeeId: string, offsetsMinutes: number[]) {
  const ticket = await db.query.tickets.findFirst({ where: eq(tickets.id, ticketId) });
  if (!ticket) throw new AppError(404, "Ticket not found");
  if (ticket.attendeeId !== attendeeId) throw new AppError(403, "This is not your ticket");

  await db.update(tickets).set({ customReminderOffsets: offsetsMinutes }).where(eq(tickets.id, ticketId));
  console.log("[reminders.service] custom reminders set for ticket:", ticketId, offsetsMinutes);

  return generateRemindersForTicket(ticketId);
}

export async function processDueReminders() {
  const due = await db.query.reminders.findMany({
    where: and(eq(reminders.status, "pending"), lte(reminders.scheduledFor, new Date())),
    with: { ticket: true, event: true },
  });

  if (due.length === 0) return;
  console.log("[reminders.service] processing", due.length, "due reminder(s)");

  for (const reminder of due) {
    try {
      const attendee = await db.query.users.findFirst({ where: eq(users.id, reminder.ticket.attendeeId) });
      if (!attendee) throw new Error("Attendee not found");

      const hoursBefore = Math.round(reminder.offsetMinutes / 60);
      await sendEmail(
        attendee.email,
        `Reminder: ${reminder.event.title} is coming up`,
        `Hi ${attendee.name}, "${reminder.event.title}" starts in about ${hoursBefore} hour(s), at ${reminder.event.location}.`
      );

      await db.update(reminders).set({ status: "sent" }).where(eq(reminders.id, reminder.id));
      console.log("[reminders.service] reminder sent and marked:", reminder.id);
    } catch (err) {
      console.log("[reminders.service] failed to process reminder:", reminder.id, (err as Error).message);
    }
  }
}