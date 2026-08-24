import { z } from "zod";

export const purchaseTicketSchema = z.object({
  eventId: z.string().uuid(),
});

export const verifyPaymentSchema = z.object({
  reference: z.string().min(1),
});

export type PurchaseTicketInput = z.infer<typeof purchaseTicketSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;