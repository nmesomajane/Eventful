import axiosInstance from "./axiosInstance";
import type { Event, CreateEventPayload } from "../types/event.types";

export const listPublishedEvents = () =>
  axiosInstance.get<Event[]>("/events").then((r) => r.data);

export const getEventById = (id: string) =>
  axiosInstance.get<Event>(`/events/${id}`).then((r) => r.data);

export const listMyEvents = () =>
  axiosInstance.get<Event[]>("/events/organizer/mine").then((r) => r.data);

export const createEvent = (payload: CreateEventPayload) =>
  axiosInstance.post<Event>("/events", payload).then((r) => r.data);

export const updateEvent = (id: string, payload: Partial<CreateEventPayload>) =>
  axiosInstance.patch<Event>(`/events/${id}`, payload).then((r) => r.data);

export const deleteEvent = (id: string) => axiosInstance.delete(`/events/${id}`);