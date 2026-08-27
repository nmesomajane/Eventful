import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";
import eventRoutes from "./modules/events/events.routes";
import ticketRoutes from "./modules/tickets/tickets.routes";
import remindersRoutes from "./modules/reminders/reminders.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/reminders", remindersRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

app.use(errorHandler);

export default app;