import { Request, Response, NextFunction } from "express";
import { processPaystackWebhook } from "./webhooks.service";

export async function paystackWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers["x-paystack-signature"] as string | undefined;
    const result = await processPaystackWebhook(req.body, signature); // req.body is a raw Buffer here
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}