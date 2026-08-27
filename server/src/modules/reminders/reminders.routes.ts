import { Router } from "express";
import * as remindersController from "./reminders.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const router = Router();

router.patch("/:id/reminders", authenticate, authorize("attendee"), remindersController.updateMyReminders);

export default router;