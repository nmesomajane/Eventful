export interface AnalyticsOverview {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalScanned: number;
}

export interface EventBreakdown {
  eventId: string;
  title: string;
  capacity: number;
  status: string;
  ticketsSold: number;
  revenue: number;
  scannedCount: number;
  scanRate: number;
}