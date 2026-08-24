import { useEffect } from "react";
import { Search } from "lucide-react";
import { useEventStore } from "../../store/eventStore";
import EventCard from "./components/EventCard";

export default function EventsListPage() {
  const { events, isLoading, error, fetchPublishedEvents } = useEventStore();

  useEffect(() => {
    console.log("[EventsListPage] mounted — triggering fetch");
    fetchPublishedEvents();
  }, [fetchPublishedEvents]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Discover events</h1>
        <p className="mt-1 text-sm text-gray-500">Find something happening near you</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">{error}</div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <Search className="h-8 w-8 text-gray-300" />
          <p className="text-gray-500">No events yet — check back soon.</p>
        </div>
      )}

      {!isLoading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}