import { useEffect } from "react";
import { useTicketStore } from "../../store/ticketStore";
import TicketCard from "./components/TicketCard";

export default function MyTicketsPage() {
  const { myTickets, isLoading, fetchMyTickets } = useTicketStore();

  useEffect(() => {
    console.log("[MyTicketsPage] mounted, fetching tickets");
    fetchMyTickets();
  }, [fetchMyTickets]);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (myTickets.length === 0) return <p className="p-6 text-gray-500">No tickets yet.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {myTickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}