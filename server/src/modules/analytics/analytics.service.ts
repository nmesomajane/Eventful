import { eq, and, sql, count } from "drizzle-orm";
import { db } from "../../config/db";
import { events, tickets } from "../../db/schema";
import { AppError } from "../../utils/AppError";

export async function getOverview(organizerId: string) {
  console.log("[analytics.service] computing overview for organizer:", organizerId);

  const [eventStats] = await db.select({ totalEvents: count() }).from(events).where(eq(events.organizerId, organizerId));

  const [ticketStats] = await db
    .select({
      totalTicketsSold: count(),
      totalRevenue: sql<string>`COALESCE(SUM(${tickets.amount}), 0)`,
      totalScanned: sql<string>`COUNT(*) FILTER (WHERE ${tickets.isScanned} = true)`,
    })
    .from(tickets)
    .innerJoin(events, eq(tickets.eventId, events.id))
    .where(and(eq(events.organizerId, organizerId), eq(tickets.status, "paid")));

  const result = {
    totalEvents: eventStats?.totalEvents ?? 0,
    totalTicketsSold: ticketStats?.totalTicketsSold ?? 0,
    totalRevenue: Number(ticketStats?.totalRevenue ?? 0),
    totalScanned: Number(ticketStats?.totalScanned ?? 0),
  };

  console.log("[analytics.service] overview result:", result);
  return result;
}

export async function getEventsBreakdown(organizerId: string) {
  console.log("[analytics.service] computing events breakdown for organizer:", organizerId);

  const rows = await db
    .select({
      eventId: events.id,
      title: events.title,
      capacity: events.capacity,
      status: events.status,
      ticketsSold: sql<string>`COUNT(${tickets.id}) FILTER (WHERE ${tickets.status} = 'paid')`,
      revenue: sql<string>`COALESCE(SUM(${tickets.amount}) FILTER (WHERE ${tickets.status} = 'paid'), 0)`,
      scannedCount: sql<string>`COUNT(*) FILTER (WHERE ${tickets.isScanned} = true)`,
    })
    .from(events)
    .leftJoin(tickets, eq(tickets.eventId, events.id))
    .where(eq(events.organizerId, organizerId))
    .groupBy(events.id);

  return rows.map((r) => ({
    eventId: r.eventId,
    title: r.title,
    capacity: r.capacity,
    status: r.status,
    ticketsSold: Number(r.ticketsSold),
    revenue: Number(r.revenue),
    scannedCount: Number(r.scannedCount),
    scanRate: Number(r.ticketsSold) > 0 ? Math.round((Number(r.scannedCount) / Number(r.ticketsSold)) * 100) : 0,
  }));
}

export async function getEventAnalytics(eventId: string, organizerId: string) {
  const event = await db.query.events.findFirst({ where: eq(events.id, eventId) });
  if (!event) throw new AppError(404, "Event not found");
  if (event.organizerId !== organizerId) throw new AppError(403, "You do not own this event");

  const [stats] = await db
    .select({
      ticketsSold: sql<string>`COUNT(*) FILTER (WHERE ${tickets.status} = 'paid')`,
      revenue: sql<string>`COALESCE(SUM(${tickets.amount}) FILTER (WHERE ${tickets.status} = 'paid'), 0)`,
      scannedCount: sql<string>`COUNT(*) FILTER (WHERE ${tickets.isScanned} = true)`,
    })
    .from(tickets)
    .where(eq(tickets.eventId, eventId));

  const ticketsSold = Number(stats?.ticketsSold ?? 0);
  const scannedCount = Number(stats?.scannedCount ?? 0);

  return {
    eventId: event.id,
    title: event.title,
    capacity: event.capacity,
    ticketsSold,
    remainingSpots: event.capacity - ticketsSold,
    revenue: Number(stats?.revenue ?? 0),
    scannedCount,
    scanRate: ticketsSold > 0 ? Math.round((scannedCount / ticketsSold) * 100) : 0,
  };
}