import { describe, it, expect, vi, beforeEach } from "vitest";
import * as ticketsService from "../tickets.service";
import { db } from "../../../config/db";

vi.mock("../../../config/db", () => ({
  db: {
    query: {
      events: { findFirst: vi.fn() },
      tickets: { findFirst: vi.fn() },
      users: { findFirst: vi.fn() },
    },
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../../../config/redis", () => ({
  redis: { del: vi.fn(), get: vi.fn(), set: vi.fn(), keys: vi.fn().mockResolvedValue([]) },
}));

vi.mock("../../reminders/reminders.service", () => ({
  generateRemindersForTicket: vi.fn().mockResolvedValue([]),
}));

describe("tickets.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initializePurchase", () => {
    it("throws 400 when event is sold out", async () => {
      (db.query.events.findFirst as any).mockResolvedValue({
        id: "event-1",
        status: "published",
        capacity: 1,
        ticketPrice: "1000",
      });
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ value: 1 }]), // already 1 sold, capacity is 1
        }),
      });

      await expect(ticketsService.initializePurchase("attendee-1", "event-1")).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it("throws 404 when event does not exist", async () => {
      (db.query.events.findFirst as any).mockResolvedValue(undefined);

      await expect(ticketsService.initializePurchase("attendee-1", "nonexistent")).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe("scanTicket", () => {
    it("rejects a second scan of the same ticket", async () => {
      (db.query.tickets.findFirst as any).mockResolvedValue({
        id: "ticket-1",
        status: "paid",
        isScanned: true, // already scanned
        event: { organizerId: "organizer-1" },
      });

      await expect(ticketsService.scanTicket("qr-code-value", "organizer-1")).rejects.toMatchObject({
        statusCode: 409,
      });
    });

    it("rejects scanning a ticket belonging to a different organizer's event", async () => {
      (db.query.tickets.findFirst as any).mockResolvedValue({
        id: "ticket-1",
        status: "paid",
        isScanned: false,
        event: { organizerId: "organizer-A" },
      });

      await expect(ticketsService.scanTicket("qr-code-value", "organizer-B")).rejects.toMatchObject({
        statusCode: 403,
      });
    });

    it("rejects an invalid/unknown QR code", async () => {
      (db.query.tickets.findFirst as any).mockResolvedValue(undefined);

      await expect(ticketsService.scanTicket("fake-code", "organizer-1")).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});