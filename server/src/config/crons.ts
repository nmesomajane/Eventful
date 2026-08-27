import cron from "node-cron";
import { processDueReminders } from "../modules/reminders/reminders.service";

export function startReminderCron() {
  cron.schedule("*/5 * * * *", () => {
    console.log("[cron] checking for due reminders...");
    processDueReminders().catch((err) => console.log("[cron] error processing reminders:", err.message));
  });
  console.log("[cron] reminder scheduler started (every 5 minutes)");
}