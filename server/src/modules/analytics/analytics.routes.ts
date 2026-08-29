import { Router } from "express";
import * as analyticsController from "./analytics.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const router = Router();

router.use(authenticate, authorize("organizer"));

/**
 * @openapi
 * /analytics/overview:
 *   get:
 *     summary: Get analytics overview
 *     tags: [Analytics]
 *     responses:
 *       200: { description: Analytics overview retrieved }
 */
router.get("/overview", analyticsController.overview);

/**
 * @openapi
 * /analytics/events:
 *   get:
 *     summary: Get events breakdown
 *     tags: [Analytics]
 *     responses:
 *       200: { description: Events breakdown retrieved }
 */
router.get("/events", analyticsController.eventsBreakdown);

/**
 * @openapi
 * /analytics/events/{id}:
 *   get:
 *     summary: Get event detail
 *     tags: [Analytics]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Event detail retrieved }
 */
router.get("/events/:id", analyticsController.eventDetail);

export default router;