import crypto from "crypto";
import { env } from "../../config/env";
import { verifyPayment } from "../tickets/tickets.service";
import { AppError } from "../../utils/AppError";

export async function processPaystackWebhook(rawBody: Buffer, signature: string | undefined) {
  if (!signature) throw new AppError(401, "Missing Paystack signature");

  const expectedHash = crypto
    .createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  if (expectedHash !== signature) {
    console.log("[webhooks.service] signature mismatch — rejecting");
    throw new AppError(401, "Invalid webhook signature");
  }

  const event = JSON.parse(rawBody.toString());
  console.log("[webhooks.service] verified event received:", event.event);

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    console.log("[webhooks.service] processing charge.success for ref:", reference);
    try {
      await verifyPayment(reference); 
      console.log("[webhooks.service] ticket confirmed via webhook:", reference);
    } catch (err) {
      console.log("[webhooks.service] verifyPayment failed for ref:", reference, (err as Error).message);
     
    }
  }

  return { received: true };
}