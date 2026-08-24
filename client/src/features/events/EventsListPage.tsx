import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEventStore } from "../../store/eventStore";
import EventCard from "./components/EventCard";

export default function EventsListPage() {
  const { events, isLoading, error, fetchPublishedEvents } = useEventStore();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    console.log("[EventsListPage] mounted — triggering fetch");
    fetchPublishedEvents();
  }, [fetchPublishedEvents]);

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category).filter(Boolean) as string[]);
    return Array.from(set);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesQuery =
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.location.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !activeCategory || e.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [events, query, activeCategory]);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-14 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Find your next experience</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-blue-100">
          Concerts, conferences, and gatherings — all in one place
        </p>

        <div className="relative mx-auto mt-6 max-w-lg">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events or locations..."
            className="w-full rounded-full border-none bg-white py-3 pl-11 pr-4 text-sm text-gray-800 shadow-lg outline-none ring-2 ring-transparent transition focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Category pills */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                activeCategory === null ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

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

        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 text-center">
            <Search className="h-8 w-8 text-gray-300" />
            <p className="text-gray-500">
              {query || activeCategory ? "No events match your search." : "No events yet — check back soon."}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}