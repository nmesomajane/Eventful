import { useEffect, useState } from "react";
import { getQrCodeImage } from "../../../api/tickets.api";
import type { Ticket } from "../../../types/ticket.types";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const [qrImage, setQrImage] = useState<string | null>(null);

  useEffect(() => {
    if (ticket.status !== "paid") return;
    console.log("[TicketCard] fetching QR image for ticket:", ticket.id);
    getQrCodeImage(ticket.id).then((res) => {
      console.log("[TicketCard] QR image received");
      setQrImage(res.qrCodeImage);
    });
  }, [ticket.id, ticket.status]);

  return (
    <div className="rounded-lg border p-4 text-center">
      <h3 className="font-semibold">{ticket.event?.title}</h3>
      <p className="text-sm text-gray-500">{ticket.event?.location}</p>
      <p className="mb-3 text-sm text-gray-500">
        {ticket.event && new Date(ticket.event.startDate).toLocaleString()}
      </p>

      {ticket.status === "paid" && qrImage && (
        <img src={qrImage} alt="Ticket QR code" className="mx-auto h-40 w-40" />
      )}
      {ticket.status === "pending" && <p className="text-yellow-600">Payment pending</p>}
      {ticket.status === "failed" && <p className="text-red-500">Payment failed</p>}
      {ticket.isScanned && <p className="mt-2 text-sm text-green-600">✓ Scanned at entry</p>}
    </div>
  );
}