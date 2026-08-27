import { Router } from "express";
import * as analyticsController from "./analytics.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const router = Router();

router.use(authenticate, authorize("organizer"));
router.get("/overview", analyticsController.overview);
router.get("/events", analyticsController.eventsBreakdown);
router.get("/events/:id", analyticsController.eventDetail);

export default router;