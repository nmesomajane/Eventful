import { Router } from "express";
import express from "express";
import { paystackWebhook } from "./webhooks.controller";

const router = Router();

router.post("/paystack", express.raw({ type: "application/json" }), paystackWebhook);

export default router;