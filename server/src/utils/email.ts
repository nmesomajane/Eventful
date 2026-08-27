import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

export async function sendEmail(to: string, subject: string, text: string) {
  if (!transporter) {
    console.log("[email] SMTP not configured — logging instead of sending");
    console.log(`[email] → to: ${to} | subject: ${subject} | body: ${text}`);
    return;
  }

  try {
    await transporter.sendMail({ from: env.SMTP_FROM, to, subject, text });
    console.log("[email] sent to:", to, "| subject:", subject);
  } catch (err) {
    console.log("[email] send failed:", (err as Error).message);
  }
}