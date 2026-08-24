import { eq, and, count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { db } from "../../config/db";
import { tickets, events,users } from "../../db/schema";
import { paystackClient } from "../../config/paystack";
import { redis } from "../../config/redis";
import { AppError } from "../../utils/AppError";
import { env } from "../../config/env";

export async function initializePurchase(attendeeId: string, eventId: string) {
  console.log("[tickets.service] initializePurchase — attendee:", attendeeId, "event:", eventId);

  const event = await db.query.events.findFirst({ where: eq(events.id, eventId) });
  if (!event) throw new AppError(404, "Event not found");
  if (event.status !== "published") throw new AppError(400, "Event is not open for ticket purchase");

  // Capacity check: count paid tickets so far
  const [{ value: soldCount }] = await db
    .select({ value: count() })
    .from(tickets)
    .where(and(eq(tickets.eventId, eventId), eq(tickets.status, "paid")));

  if (soldCount >= event.capacity) {
    console.log("[tickets.service] event sold out:", eventId, soldCount, "/", event.capacity);
    throw new AppError(400, "Event is sold out");
  }

  const reference = `evt_${uuidv4()}`;
  const amountKobo = Math.round(Number(event.ticketPrice) * 100); // Paystack expects kobo

  const [ticket] = await db
    .insert(tickets)
    .values({
      eventId,
      attendeeId,
      amount: event.ticketPrice,
      status: "pending",
      paystackReference: reference,
    })
    .returning();

  console.log("[tickets.service] pending ticket created:", ticket.id, "ref:", reference);

  // Free events skip Paystack entirely
  if (amountKobo === 0) {
    const paid = await markTicketPaid(ticket.id);
    console.log("[tickets.service] free event — ticket auto-confirmed:", paid.id);
    return { ticket: paid, authorizationUrl: null };
  }

  const paystackRes = await paystackClient.post("/transaction/initialize", {
    email: (await getAttendeeEmail(attendeeId)),
    amount: amountKobo,
    reference,
    callback_url: `${env.CLIENT_URL}/payment/callback`,
  });

  console.log("[tickets.service] paystack init response status:", paystackRes.data?.status);
  return { ticket, authorizationUrl: paystackRes.data.data.authorization_url };
}

export async function verifyPayment(reference: string) {
  console.log("[tickets.service] verifying payment for ref:", reference);

  const ticket = await db.query.tickets.findFirst({ where: eq(tickets.paystackReference, reference) });
  if (!ticket) throw new AppError(404, "Ticket not found for this reference");

  if (ticket.status === "paid") {
    console.log("[tickets.service] already verified, skipping re-check:", ticket.id);
    return ticket;
  }

  const verifyRes = await paystackClient.get(`/transaction/verify/${reference}`);
  const paystackStatus = verifyRes.data?.data?.status;
  console.log("[tickets.service] paystack verify status:", paystackStatus);

  if (paystackStatus !== "success") {
    await db.update(tickets).set({ status: "failed", updatedAt: new Date() }).where(eq(tickets.id, ticket.id));
    throw new AppError(400, "Payment was not successful");
  }

  return markTicketPaid(ticket.id);
}

async function markTicketPaid(ticketId: string) {
  const qrPayload = `${ticketId}:${uuidv4()}`; // unique, unguessable
  const [updated] = await db
    .update(tickets)
    .set({ status: "paid", qrCode: qrPayload, updatedAt: new Date() })
    .where(eq(tickets.id, ticketId))
    .returning();

  await redis.del(`events:${updated.eventId}`); // capacity/count changed, invalidate event cache
  console.log("[tickets.service] ticket marked paid with QR:", updated.id);
  return updated;
}

export async function getQrCodeImage(ticketId: string, requesterId: string) {
  const ticket = await db.query.tickets.findFirst({ where: eq(tickets.id, ticketId) });
  if (!ticket) throw new AppError(404, "Ticket not found");
  if (ticket.attendeeId !== requesterId) throw new AppError(403, "This is not your ticket");
  if (ticket.status !== "paid" || !ticket.qrCode) throw new AppError(400, "Ticket is not paid yet");

  const dataUrl = await QRCode.toDataURL(ticket.qrCode);
  console.log("[tickets.service] QR image generated for ticket:", ticketId);
  return dataUrl;
}

export async function getMyTickets(attendeeId: string) {
  console.log("[tickets.service] fetching tickets for attendee:", attendeeId);
  return db.query.tickets.findMany({
    where: eq(tickets.attendeeId, attendeeId),
    with: { event: true },
  });
}

export async function scanTicket(qrCode: string, organizerId: string) {
  console.log("[tickets.service] scan attempt with code:", qrCode);

  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.qrCode, qrCode),
    with: { event: true },
  });

  if (!ticket) throw new AppError(404, "Invalid QR code");
  if ((ticket.event as { organizerId: string }).organizerId !== organizerId) {
    console.log("[tickets.service] scan rejected — organizer mismatch");
    throw new AppError(403, "This ticket does not belong to your event");
  }
  if (ticket.status !== "paid") throw new AppError(400, "Ticket is not valid (unpaid)");
  if (ticket.isScanned) {
    console.log("[tickets.service] duplicate scan attempt:", ticket.id);
    throw new AppError(409, "Ticket already scanned");
  }

  const [updated] = await db
    .update(tickets)
    .set({ isScanned: true, scannedAt: new Date() })
    .where(eq(tickets.id, ticket.id))
    .returning();

  console.log("[tickets.service] ticket scanned successfully:", updated.id);
  return updated;
}

async function getAttendeeEmail(attendeeId: string) {

  const user = await db.query.users.findFirst({ where: eq(users.id, attendeeId) });
  if (!user) throw new AppError(404, "Attendee not found");
  return user.email;
}