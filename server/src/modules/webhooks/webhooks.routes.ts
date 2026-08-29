import { Router } from "express";
import express from "express";
import { paystackWebhook } from "./webhooks.controller";

const router = Router();

/**
 * @openapi
 * /webhooks/paystack:
 *   post:  
 *    summary: Handle Paystack webhook events
 *   tags: [Webhooks]
 *  requestBody:
 *    required: true
 *   content:
 *    application/json:
 *     schema:
 *      type: object
 *    properties:
 *     event: { type: string }
 *    data: { type: object }
 * responses:
 *     200: { description: Webhook event processed }
 * 
 */
router.post("/paystack", express.raw({ type: "application/json" }), paystackWebhook);

export default router;