import axiosInstance from "./axiosInstance";
import type { Ticket, PurchaseResponse } from "../types/ticket.types";

export const purchaseTicket = (eventId: string) =>
  axiosInstance.post<PurchaseResponse>("/tickets/purchase", { eventId }).then((r) => r.data);

export const verifyPayment = (reference: string) =>
  axiosInstance.get<Ticket>(`/tickets/verify/${reference}`).then((r) => r.data);

export const getQrCodeImage = (ticketId: string) =>
  axiosInstance.get<{ qrCodeImage: string }>(`/tickets/${ticketId}/qrcode`).then((r) => r.data);

export const listMyTickets = () =>
  axiosInstance.get<Ticket[]>("/tickets/mine").then((r) => r.data);