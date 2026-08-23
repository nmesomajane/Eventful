import { create } from "zustand";
import * as eventsApi from "../api/events.api";
import type { Event, CreateEventPayload } from "../types/event.types";

interface EventState {
  events: Event[];
  myEvents: Event[];
  isLoading: boolean;
  error: string | null;
  fetchPublishedEvents: () => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  createEvent: (payload: CreateEventPayload) => Promise<void>;
  updateEvent: (id: string, payload: Partial<CreateEventPayload>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  myEvents: [],
  isLoading: false,
  error: null,

  fetchPublishedEvents: async () => {
    console.log("[eventStore] fetching published events");
    set({ isLoading: true, error: null });
    try {
      const events = await eventsApi.listPublishedEvents();
      console.log("[eventStore] received", events.length, "events");
      set({ events, isLoading: false });
    } catch (err: any) {
      console.log("[eventStore] fetchPublishedEvents error:", err?.response?.data);
      set({ error: err?.response?.data?.error || "Failed to load events", isLoading: false });
    }
  },

  fetchMyEvents: async () => {
    console.log("[eventStore] fetching my events");
    set({ isLoading: true, error: null });
    try {
      const myEvents = await eventsApi.listMyEvents();
      set({ myEvents, isLoading: false });
    } catch (err: any) {
      console.log("[eventStore] fetchMyEvents error:", err?.response?.data);
      set({ error: err?.response?.data?.error || "Failed to load your events", isLoading: false });
    }
  },

  createEvent: async (payload) => {
    console.log("[eventStore] creating event:", payload.title);
    const newEvent = await eventsApi.createEvent(payload);
    console.log("[eventStore] created event id:", newEvent.id);
    set({ myEvents: [newEvent, ...get().myEvents] });
  },

  updateEvent: async (id, payload) => {
    const updated = await eventsApi.updateEvent(id, payload);
    set({ myEvents: get().myEvents.map((e) => (e.id === id ? updated : e)) });
  },

  deleteEvent: async (id) => {
    await eventsApi.deleteEvent(id);
    console.log("[eventStore] deleted event id:", id);
    set({ myEvents: get().myEvents.filter((e) => e.id !== id) });
  },
}));