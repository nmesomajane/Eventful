import axios from "axios";
import { env } from "./env";

export const paystackClient = axios.create({
  baseURL: env.PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});