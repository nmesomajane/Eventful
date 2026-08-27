import axiosInstance from "./axiosInstance";
import type { AnalyticsOverview, EventBreakdown } from "../types/analytics.types";

export const getOverview = () => axiosInstance.get<AnalyticsOverview>("/analytics/overview").then((r) => r.data);
export const getEventsBreakdown = () => axiosInstance.get<EventBreakdown[]>("/analytics/events").then((r) => r.data);