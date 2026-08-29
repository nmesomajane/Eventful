import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "../features/auth/SignUpPage";
import LoginPage from "../features/auth/LoginPage";
import EventsListPage from "../features/events/EventsListPage";
import MyEventsPage from "../features/events/MyEventsPage";
import CreateEventPage from "../features/events/CreateEventPage";
import EventDetailPage from "../features/events/EventDetailPage";
import PaymentCallbackPage from "../features/tickets/PaymentCallbackPage";
import MyTicketsPage from "../features/tickets/MyTicketsPage";
import AnalyticsPage from "../features/analytics/AnalyticsPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/payment/callback" element={<PaymentCallbackPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
        <Route path="/organizer/events" element={<MyEventsPage />} />
        <Route path="/organizer/events/new" element={<CreateEventPage />} />
        <Route path="/organizer/analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<ProtectedRoute allowedRoles={["attendee"]} />}>
        <Route path="/my-tickets" element={<MyTicketsPage />} />
      </Route>
    </Routes>
  );
}
