import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: required("DATABASE_URL"),
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: "15m",
  JWT_REFRESH_EXPIRES_IN: "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  PAYSTACK_SECRET_KEY: required("PAYSTACK_SECRET_KEY"),
 PAYSTACK_BASE_URL: process.env.PAYSTACK_BASE_URL || "https://api.paystack.co",

 SMTP_HOST: process.env.SMTP_HOST,
SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
SMTP_USER: process.env.SMTP_USER,
SMTP_PASS: process.env.SMTP_PASS,
SMTP_FROM: process.env.SMTP_FROM || "Eventful <no-reply@eventful.dev>",
};




