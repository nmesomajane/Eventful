import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getEventById } from "../../api/events.api";
import { useTicketStore } from "../../store/ticketStore";
import { useAuthStore } from "../../store/authStore";
import type { Event } from "../../types/event.types";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const purchase = useTicketStore((s) => s.purchase);
  const [event, setEvent] = useState<Event | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!id) return;
    console.log("[EventDetailPage] fetching event:", id);
    getEventById(id).then((data) => {
      console.log("[EventDetailPage] event loaded:", data.title);
      setEvent(data);
    });
  }, [id]);

  const handleBuy = async () => {
    if (!id) return;
    setBuying(true);
    try {
      const { authorizationUrl, ticket } = await purchase(id);
      if (authorizationUrl) {
        console.log("[EventDetailPage] redirecting to Paystack:", authorizationUrl);
        window.location.href = authorizationUrl; // Paystack hosted checkout
      } else {
        console.log("[EventDetailPage] free event, ticket confirmed instantly:", ticket.id);
        toast.success("Ticket confirmed!");
        navigate("/my-tickets");
      }
    } catch {
      toast.error("Could not start purchase");
    } finally {
      setBuying(false);
    }
  };

  if (!event) return <p className="p-6">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      {event.coverImageUrl && <img src={event.coverImageUrl} className="mb-4 h-56 w-full rounded object-cover" />}
      <h1 className="text-2xl font-semibold">{event.title}</h1>
      <p className="text-gray-500">{event.location}</p>
      <p className="mt-2">{event.description}</p>
      <p className="mt-4 text-lg font-medium">
        {Number(event.ticketPrice) === 0 ? "Free" : `₦${event.ticketPrice}`}
      </p>

      {user?.role === "attendee" && (
        <button
          onClick={handleBuy}
          disabled={buying}
          className="mt-6 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {buying ? "Processing..." : "Buy Ticket"}
        </button>
      )}
    </div>
  );
}