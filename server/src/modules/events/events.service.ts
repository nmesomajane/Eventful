import { eq, and, gte, desc } from "drizzle-orm";
import { db } from "../../config/db";
import { events } from "../../db/schema";
import { redis } from "../../config/redis";
import { AppError } from "../../utils/AppError";
import type { CreateEventInput, UpdateEventInput, ListEventsQuery } from "./events.validators";

const CACHE_TTL = 60; // seconds

export async function createEvent(organizerId: string, input: CreateEventInput) {
  console.log("[events.service] createEvent called by organizer:", organizerId);

  const [event] = await db
    .insert(events)
    .values({ ...input, ticketPrice: String(input.ticketPrice), organizerId })
    .returning();

  console.log("[events.service] event created with id:", event.id);
  await invalidatePublicListCache();
  return event;
}

export async function getPublishedEvents(query: ListEventsQuery) {
  const cacheKey = `events:list:${JSON.stringify(query)}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("[events.service] cache HIT for", cacheKey);
    return JSON.parse(cached);
  }
  console.log("[events.service] cache MISS for", cacheKey, "— querying DB");

  const conditions = [eq(events.status, "published")];
  if (query.upcoming) conditions.push(gte(events.startDate, new Date()));

  const results = await db.query.events.findMany({
    where: and(...conditions),
    orderBy: desc(events.startDate),
    limit: query.limit,
    offset: (query.page - 1) * query.limit,
  });

  await redis.set(cacheKey, JSON.stringify(results), "EX", CACHE_TTL);
  return results;
}

export async function getEventById(id: string) {
  const cacheKey = `events:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("[events.service] cache HIT for", cacheKey);
    return JSON.parse(cached);
  }

  const event = await db.query.events.findFirst({ where: eq(events.id, id) });
  if (!event) throw new AppError(404, "Event not found");

  await redis.set(cacheKey, JSON.stringify(event), "EX", CACHE_TTL);
  console.log("[events.service] cache SET for", cacheKey);
  return event;
}

export async function getMyEvents(organizerId: string) {
  console.log("[events.service] fetching events for organizer:", organizerId);
  return db.query.events.findMany({
    where: eq(events.organizerId, organizerId),
    orderBy: desc(events.createdAt),
  });
}

export async function updateEvent(id: string, organizerId: string, input: UpdateEventInput) {
  const existing = await db.query.events.findFirst({ where: eq(events.id, id) });
  if (!existing) throw new AppError(404, "Event not found");
  if (existing.organizerId !== organizerId) {
    console.log("[events.service] ownership check FAILED:", organizerId, "!=", existing.organizerId);
    throw new AppError(403, "You do not own this event");
  }

  const { ticketPrice, ...updateFields } = input;
  const [updated] = await db
    .update(events)
    .set({
      ...updateFields,
      ...(ticketPrice !== undefined ? { ticketPrice: String(ticketPrice) } : {}),
      updatedAt: new Date(),
    })
    .where(eq(events.id, id))
    .returning();

  await redis.del(`events:${id}`);
  await invalidatePublicListCache();
  console.log("[events.service] event updated:", id);
  return updated;
}

export async function deleteEvent(id: string, organizerId: string) {
  const existing = await db.query.events.findFirst({ where: eq(events.id, id) });
  if (!existing) throw new AppError(404, "Event not found");
  if (existing.organizerId !== organizerId) throw new AppError(403, "You do not own this event");

  await db.delete(events).where(eq(events.id, id));
  await redis.del(`events:${id}`);
  await invalidatePublicListCache();
  console.log("[events.service] event deleted:", id);
}

async function invalidatePublicListCache() {
  const keys = await redis.keys("events:list:*");
  if (keys.length) {
    await redis.del(...keys);
    console.log("[events.service] invalidated", keys.length, "list cache entries");
  }
}

async function safeCacheGet(key: string): Promise<string | null> {
  try {
    return await redis.get(key);
  } catch (err) {
    console.log("[redis] read failed, falling back to DB:", (err as Error).message);
    return null;
  }
}

async function safeCacheSet(key: string, value: string, ttl: number) {
  try {
    await redis.set(key, value, "EX", ttl);
  } catch (err) {
    console.log("[redis] write failed, skipping cache:", (err as Error).message);
  }
}