import { Router } from "express";
import * as ticketsController from "./tickets.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { purchaseRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/purchase", purchaseRateLimiter, authenticate, authorize("attendee"), ticketsController.purchase);
router.get("/verify/:reference", authenticate, ticketsController.verify);
router.get("/:id/qrcode", authenticate, ticketsController.getQrCode);
router.get("/mine", authenticate, authorize("attendee"), ticketsController.mine);
router.post("/scan", authenticate, authorize("organizer"), ticketsController.scan);

export default router;