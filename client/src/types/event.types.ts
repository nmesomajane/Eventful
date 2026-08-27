export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category?: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  ticketPrice: string;
  coverImageUrl?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  category?: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  ticketPrice: number;
  coverImageUrl?: string;
  reminderOffsets: number[];
  status: "draft" | "published";
}