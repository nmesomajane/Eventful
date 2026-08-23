import { useEffect } from "react";
import { useEventStore } from "../../store/eventStore";
import toast from "react-hot-toast";

export default function MyEventsPage() {
  const { myEvents, isLoading, fetchMyEvents, deleteEvent } = useEventStore();

  useEffect(() => {
    console.log("[MyEventsPage] mounted — fetching organizer's events");
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
    } catch (err) {
      console.log("[MyEventsPage] delete failed:", err);
      toast.error("Failed to delete event");
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">My Events</h1>
      <div className="space-y-3">
        {myEvents.map((event) => (
          <div key={event.id} className="flex items-center justify-between rounded border p-3">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-500">{event.status}</p>
            </div>
            <button onClick={() => handleDelete(event.id)} className="text-sm text-red-500">
              Delete
            </button>
          </div>
        ))}
        {myEvents.length === 0 && <p className="text-gray-500">You haven't created any events yet.</p>}
      </div>
    </div>
  );
}