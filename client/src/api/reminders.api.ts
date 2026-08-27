import axiosInstance from "./axiosInstance";

export const updateTicketReminders = (ticketId: string, offsetsMinutes: number[]) =>
  axiosInstance.patch(`/tickets/${ticketId}/reminders`, { offsetsMinutes }).then((r) => r.data);