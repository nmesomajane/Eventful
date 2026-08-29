import { Router } from "express";
import * as eventsController from "./events.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const router = Router();

// Public browsing
/**
 * @openapi
 * /events:
 *   get:
 *     summary: List events
 *     tags: [Events]
 *     responses:
 *       200: { description: Events listed }
 */
router.get("/", eventsController.list);
/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Get event details
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Event details retrieved }
 */
router.get("/:id", eventsController.getOne);

// Organizer-only
/**
 * @openapi
 * /events/organizer/mine:
 *   get:
 *     summary: Get organizer's events
 *     tags: [Events]
 *     responses:
 *       200: { description: Events retrieved }
 */
router.get("/organizer/mine", authenticate, authorize("organizer"), eventsController.mine);
/**
 * @openapi
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, date, location]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               date: { type: string, format: date }
 *               location: { type: string }
 *     responses:
 *       201: { description: Event created }
 */
router.post("/", authenticate, authorize("organizer"), eventsController.create);
/**
 * @openapi
 * /events/{id}:
 *   patch:
 *     summary: Update an existing event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
*               date: { type: string, format: date }
*               location: { type: string }
*     responses:
*       200: { description: Event updated }
*/
router.patch("/:id", authenticate, authorize("organizer"), eventsController.update);
/**
* @openapi
* /events/{id}:
*   delete:
*     summary: Delete an event
*     tags: [Events]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         schema:
*           type：string
*     responses:
*       200：{ description：Event deleted }
*/
router.delete("/:id", authenticate, authorize("organizer"), eventsController.remove);

export default router;