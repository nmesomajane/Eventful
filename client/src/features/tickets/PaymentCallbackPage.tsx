import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTicketStore } from "../../store/ticketStore";
import type { Ticket } from "../../types/ticket.types";

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const verify = useTicketStore((s) => s.verify);
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    console.log("[PaymentCallbackPage] reference from URL:", reference);
    if (!reference) {
      setStatus("failed");
      return;
    }

    verify(reference)
      .then((t) => {
        console.log("[PaymentCallbackPage] verified ticket status:", t.status);
        setTicket(t);
        setStatus(t.status === "paid" ? "success" : "failed");
      })
      .catch((err) => {
        console.log("[PaymentCallbackPage] verification error:", err);
        setStatus("failed");
      });
  }, [searchParams, verify]);

  if (status === "loading") return <p className="p-6">Confirming your payment...</p>;

  if (status === "failed") {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Payment could not be confirmed.</p>
        <Link to="/dashboard" className="text-blue-600 underline">Back to events</Link>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <p className="text-lg font-medium text-green-600">Payment successful!</p>
      <p className="text-gray-500">Ticket ID: {ticket?.id}</p>
      <Link to="/my-tickets" className="mt-4 inline-block text-blue-600 underline">
        View your tickets
      </Link>
    </div>
  );
}