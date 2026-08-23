import type { Event } from "../../../types/event.types";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      {event.coverImageUrl && (
        <img src={event.coverImageUrl} alt={event.title} className="h-40 w-full object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500">{event.location}</p>
        <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
        <p className="mt-2 font-medium">
          {Number(event.ticketPrice) === 0 ? "Free" : `₦${event.ticketPrice}`}
        </p>
      </div>
    </div>
  );
}