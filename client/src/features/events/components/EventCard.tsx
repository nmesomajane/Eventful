import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import type { Event } from "../../../types/event.types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop";

export default function EventCard({ event }: { event: Event }) {
  const isFree = Number(event.ticketPrice) === 0;

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <img
          src={event.coverImageUrl || FALLBACK_IMAGE}
          alt={event.title}
          onError={(e) => {
            console.log("[EventCard] image failed to load, using fallback:", event.coverImageUrl);
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {event.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur">
            {event.category}
          </span>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isFree ? "bg-green-100 text-green-700" : "bg-blue-600 text-white"
          }`}
        >
          {isFree ? "Free" : `₦${Number(event.ticketPrice).toLocaleString()}`}
        </span>
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-1 font-semibold text-gray-900">{event.title}</h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>
            {new Date(event.startDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}