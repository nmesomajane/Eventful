import { z } from "zod";

const eventFields = {
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(1000),
  category: z.string().max(100).optional(),
  location: z.string().min(3).max(255),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  capacity: z.number().int().positive(),
  ticketPrice: z.number().nonnegative().default(0),
  reminderOffsets: z.array(z.number().int().positive()).min(1).default([1440]),
  coverImageUrl: z.string().url().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
};

export const createEventSchema = z
  .object(eventFields)
  .refine((data) => data.endDate > data.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export const updateEventSchema = z
  .object(eventFields)
  .partial()
  .refine(
    (data) =>
      data.startDate === undefined ||
      data.endDate === undefined ||
      data.endDate > data.startDate,
    {
      message: "endDate must be after startDate",
      path: ["endDate"],
    }
  );

export const listEventsQuerySchema = z.object({
  category: z.string().optional(),
  upcoming: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;