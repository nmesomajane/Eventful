import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Calendar, Users, Loader2, ArrowLeft } from "lucide-react";
import { getEventById } from "../../api/events.api";
import { useTicketStore } from "../../store/ticketStore";
import { useAuthStore } from "../../store/authStore";
import type { Event } from "../../types/event.types";
import ShareButton from "../../components/ShareButton";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=500&fit=crop";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const purchase = useTicketStore((s) => s.purchase);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!id) return;
    console.log("[EventDetailPage] fetching event:", id);
    getEventById(id)
      .then((data) => {
        console.log("[EventDetailPage] event loaded:", data.title);
        setEvent(data);
      })
      .catch((err) => {
        console.log("[EventDetailPage] fetch failed:", err?.response?.data);
        toast.error("Could not load this event");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!id) return;
    setBuying(true);
    try {
      const { authorizationUrl, ticket } = await purchase(id);
      if (authorizationUrl) {
        console.log("[EventDetailPage] redirecting to Paystack:", authorizationUrl);
        window.location.href = authorizationUrl;
      } else {
        console.log("[EventDetailPage] free event, ticket confirmed instantly:", ticket.id);
        toast.success("Ticket confirmed!");
        navigate("/my-tickets");
      }
    } catch (err: any) {
      console.log("[EventDetailPage] purchase failed:", err?.response?.data);
      toast.error(err?.response?.data?.error || "Could not start purchase");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        <div className="mt-6 h-6 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-gray-500">Event not found.</p>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-blue-600 hover:underline">
          Back to events
        </button>
      </div>
    );
  }

  const isFree = Number(event.ticketPrice) === 0;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 mt-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="overflow-hidden rounded-2xl">
        <img
          src={event.coverImageUrl || FALLBACK_IMAGE}
          alt={event.title}
          onError={(e) => {
            console.log("[EventDetailPage] image failed, using fallback");
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
          className="h-72 w-full object-cover"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          {event.category && (
            <span className="mb-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              {event.category}
            </span>
          )}
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{event.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-4 py-2 text-base font-semibold ${
              isFree ? "bg-green-100 text-green-700" : "bg-blue-600 text-white"
            }`}
          >
            {isFree ? "Free" : `₦${Number(event.ticketPrice).toLocaleString()}`}
          </span>
          <ShareButton title={event.title} url={window.location.href} />
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" /> {event.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          {new Date(event.startDate).toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4 text-gray-400" /> {event.capacity} spots available
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">About this event</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{event.description}</p>
      </div>

      {user?.role === "attendee" && (
        <button
          onClick={handleBuy}
          disabled={buying}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50 sm:w-auto sm:px-10"
        >
          {buying && <Loader2 className="h-4 w-4 animate-spin" />}
          {buying ? "Processing..." : isFree ? "Get Free Ticket" : "Buy Ticket"}
        </button>
      )}
    </div>
  );
}