import { create } from "zustand";
import * as ticketsApi from "../api/tickets.api";
import type { Ticket } from "../types/ticket.types";

interface TicketState {
  myTickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  purchase: (eventId: string) => Promise<{ authorizationUrl: string | null; ticket: Ticket }>;
  verify: (reference: string) => Promise<Ticket>;
  fetchMyTickets: () => Promise<void>;
}

export const useTicketStore = create<TicketState>((set) => ({
  myTickets: [],
  isLoading: false,
  error: null,

  purchase: async (eventId) => {
    console.log("[ticketStore] initiating purchase for event:", eventId);
    set({ isLoading: true, error: null });
    try {
      const result = await ticketsApi.purchaseTicket(eventId);
      console.log("[ticketStore] purchase initialized, authUrl:", result.authorizationUrl);
      set({ isLoading: false });
      return result;
    } catch (err: any) {
      console.log("[ticketStore] purchase failed:", err?.response?.data);
      set({ error: err?.response?.data?.error || "Purchase failed", isLoading: false });
      throw err;
    }
  },

  verify: async (reference) => {
    console.log("[ticketStore] verifying payment ref:", reference);
    set({ isLoading: true, error: null });
    try {
      const ticket = await ticketsApi.verifyPayment(reference);
      console.log("[ticketStore] verification result:", ticket.status);
      set({ isLoading: false });
      return ticket;
    } catch (err: any) {
      console.log("[ticketStore] verify failed:", err?.response?.data);
      set({ error: err?.response?.data?.error || "Verification failed", isLoading: false });
      throw err;
    }
  },

  fetchMyTickets: async () => {
    console.log("[ticketStore] fetching my tickets");
    set({ isLoading: true, error: null });
    try {
      const myTickets = await ticketsApi.listMyTickets();
      console.log("[ticketStore] received", myTickets.length, "tickets");
      set({ myTickets, isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || "Failed to load tickets", isLoading: false });
    }
  },
}));