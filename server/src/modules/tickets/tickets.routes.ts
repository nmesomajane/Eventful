import { Router } from "express";
import * as ticketsController from "./tickets.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { purchaseRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

/**
 * @openapi
 * /tickets/purchase:
 *   post:
 *     summary: Purchase a ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event_id, quantity]
 *             properties:
 *               event_id: { type: string }
 *               quantity: { type: number }
 *     responses:
 *       201: { description: Ticket purchased }
 *       400: { description: Invalid request }
 */
router.post("/purchase", purchaseRateLimiter, authenticate, authorize("attendee"), ticketsController.purchase);

/**
 * @openapi
 * /tickets/verify/{reference}:
 *   get:
 *     summary: Verify a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - name: reference
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Ticket verified }
 *       404: { description: Ticket not found }
 */
router.get("/verify/:reference", authenticate, ticketsController.verify);

/**
 * @openapi
 * /tickets/{id}/qrcode:
 *   get:
 *     summary: Get a ticket's QR code
 *     tags: [Tickets]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: QR code retrieved }
 */
router.get("/:id/qrcode", authenticate, ticketsController.getQrCode);

/**
 * @openapi
 * /tickets/mine:
*   get:
*     summary: Get user's tickets
*     tags: [Tickets]
*     responses:
*       200: { description: Tickets retrieved }
*/
router.get("/mine", authenticate, authorize("attendee"), ticketsController.mine);

/**
* @openapi
* /tickets/scan:
*   post:
*     summary: Scan a ticket's QR code
*     tags: [Tickets]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required: [ticket_id]
*             properties:
*               ticket_id: { type：string }
*     responses:
*       200：{ description：Ticket scanned }
*/
router.post("/scan", authenticate, authorize("organizer"), ticketsController.scan);

export default router;