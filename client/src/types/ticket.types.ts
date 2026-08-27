export type TicketStatus = "pending" | "paid" | "failed" | "cancelled";

export interface Ticket {
  id: string;
  eventId: string;
  attendeeId: string;
  amount: string;
  status: TicketStatus;
  paystackReference: string;
  qrCode: string | null;
  isScanned: boolean;
  scannedAt: string | null;
  createdAt: string;
  event?: {
    id: string;
    title: string;
    startDate: string;
    location: string;
  };
  customReminderOffsets: number[] | null;
}

export interface PurchaseResponse {
  ticket: Ticket;
  authorizationUrl: string | null;
}