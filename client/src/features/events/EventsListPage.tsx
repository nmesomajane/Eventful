import { useEffect } from "react";
import { useEventStore } from "../../store/eventStore";
import EventCard from "./components/EventCard";

export default function EventsListPage() {
  const { events, isLoading, error, fetchPublishedEvents } = useEventStore();

  useEffect(() => {
    console.log("[EventsListPage] mounted — triggering fetch");
    fetchPublishedEvents();
  }, [fetchPublishedEvents]);

  if (isLoading) return <p className="p-6">Loading events...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (events.length === 0) return <p className="p-6 text-gray-500">No events yet.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}