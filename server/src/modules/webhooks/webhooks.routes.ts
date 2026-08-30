import { Router } from "express";
import express from "express";
import { paystackWebhook } from "./webhooks.controller";

const router = Router();

/**
/**
 * @openapi
 * /webhooks/paystack:
 *   post:
 *     summary: Paystack payment webhook
 *     tags: [Webhooks]
 *     description: Receives payment confirmation events directly from Paystack's servers.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 *       401:
 *         description: Invalid or missing signature
 */
router.post("/paystack", express.raw({ type: "application/json" }), paystackWebhook);

export default router;