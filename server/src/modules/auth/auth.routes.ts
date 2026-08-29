import { Router } from "express";
import * as authController from "./auth.controller";
import { authRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string, example: "Jane Doe" }
 *               email: { type: string, example: "jane@example.com" }
 *               password: { type: string, example: "password123" }
 *               role: { type: string, enum: [organizer, attendee] }
 *     responses:
 *       201: { description: Account created }
 *       409: { description: Email already in use }
 */
router.post("/signup", authRateLimiter, authController.signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Logged in }
 *       401: { description: Invalid credentials }
 */
router.post("/login", authRateLimiter, authController.login);
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logged out }
 */
router.post("/logout", authController.logout);

export default router;