import { useEffect, useState } from "react";
import { getQrCodeImage } from "../../../api/tickets.api";
import type { Ticket } from "../../../types/ticket.types";

import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import ReminderPicker from "../../../components/ReminderPicker";
import { updateTicketReminders } from "../../../api/reminders.api";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const [qrImage, setQrImage] = useState<string | null>(null);
    const [showReminders, setShowReminders] = useState(false);
  const [selectedOffsets, setSelectedOffsets] = useState<number[]>(ticket.customReminderOffsets ?? [1440]);
  const [saving, setSaving] = useState(false);


   const handleSaveReminders = async () => {
    setSaving(true);
    try {
      await updateTicketReminders(ticket.id, selectedOffsets);
      console.log("[TicketCard] reminders updated for ticket:", ticket.id);
      toast.success("Reminder preferences saved");
      setShowReminders(false);
    } catch (err) {
      console.log("[TicketCard] failed to update reminders:", err);
      toast.error("Could not save reminder preferences");
    } finally {
      setSaving(false);
    }
  };

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

        {ticket.status === "paid" && (
        <div className="mt-3 border-t pt-3">
          <button
            onClick={() => setShowReminders((prev) => !prev)}
            className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
          >
            <Bell className="h-3.5 w-3.5" /> Reminder settings
          </button>

          {showReminders && (
            <div className="mt-3 space-y-3 text-left">
              <ReminderPicker selected={selectedOffsets} onChange={setSelectedOffsets} />
              <button
                onClick={handleSaveReminders}
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 py-1.5 text-xs font-medium text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}