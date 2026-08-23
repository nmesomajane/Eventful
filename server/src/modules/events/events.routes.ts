import { Router } from "express";
import * as eventsController from "./events.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const router = Router();

// Public browsing
router.get("/", eventsController.list);
router.get("/:id", eventsController.getOne);

// Organizer-only
router.get("/organizer/mine", authenticate, authorize("organizer"), eventsController.mine);
router.post("/", authenticate, authorize("organizer"), eventsController.create);
router.patch("/:id", authenticate, authorize("organizer"), eventsController.update);
router.delete("/:id", authenticate, authorize("organizer"), eventsController.remove);

export default router;