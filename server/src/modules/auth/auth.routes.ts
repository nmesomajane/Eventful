import { Router } from "express";
import * as authController from "./auth.controller";
import { authRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/signup", authRateLimiter, authController.signup);
router.post("/login", authRateLimiter, authController.login);
router.post("/logout", authController.logout);

export default router;