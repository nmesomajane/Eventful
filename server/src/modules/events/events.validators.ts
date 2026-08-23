import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
  category: z.string().max(100).optional(),
  location: z.string().min(3).max(255),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  capacity: z.number().int().positive(),
  ticketPrice: z.number().nonnegative().default(0),
  coverImageUrl: z.string().url().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
}).refine((data) => data.endDate > data.startDate, {
  message: "endDate must be after startDate",
  path: ["endDate"],
});

export const updateEventSchema = createEventSchema.partial();

export const listEventsQuerySchema = z.object({
  category: z.string().optional(),
  upcoming: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;