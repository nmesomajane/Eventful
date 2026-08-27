import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Calendar, Ticket, DollarSign, ScanLine } from "lucide-react";
import { getOverview, getEventsBreakdown } from "../../api/analytics.api";
import type { AnalyticsOverview, EventBreakdown } from "../../types/analytics.types";

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [breakdown, setBreakdown] = useState<EventBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AnalyticsPage] fetching overview and breakdown");
    Promise.all([getOverview(), getEventsBreakdown()])
      .then(([ov, br]) => {
        console.log("[AnalyticsPage] overview:", ov, "| breakdown rows:", br.length);
        setOverview(ov);
        setBreakdown(br);
      })
      .catch((err) => console.log("[AnalyticsPage] fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  const chartData = breakdown.map((e) => ({ name: e.title.slice(0, 14), sold: e.ticketsSold, scanned: e.scannedCount }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Calendar} label="Total events" value={overview?.totalEvents ?? 0} />
        <StatCard icon={Ticket} label="Tickets sold" value={overview?.totalTicketsSold ?? 0} />
        <StatCard icon={DollarSign} label="Total revenue" value={`₦${(overview?.totalRevenue ?? 0).toLocaleString()}`} />
        <StatCard icon={ScanLine} label="Tickets scanned" value={overview?.totalScanned ?? 0} />
      </div>

      {breakdown.length > 0 && (
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Tickets sold vs scanned, per event</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="sold" fill="#2563eb" radius={[4, 4, 0, 0]} name="Sold" />
              <Bar dataKey="scanned" fill="#16a34a" radius={[4, 4, 0, 0]} name="Scanned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Sold / Capacity</th>
              <th className="px-4 py-3 font-medium">Revenue</th>
              <th className="px-4 py-3 font-medium">Scan rate</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((e) => (
              <tr key={e.eventId} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">{e.title}</td>
                <td className="px-4 py-3 capitalize text-gray-500">{e.status}</td>
                <td className="px-4 py-3 text-gray-600">{e.ticketsSold} / {e.capacity}</td>
                <td className="px-4 py-3 text-gray-600">₦{e.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{e.scanRate}%</td>
              </tr>
            ))}
            {breakdown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No events yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}