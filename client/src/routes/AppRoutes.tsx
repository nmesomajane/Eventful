import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "../features/auth/SignUpPage";
import LoginPage from "../features/auth/LoginPage";
import EventsListPage from "../features/events/EventsListPage";
import MyEventsPage from "../features/events/MyEventsPage";
import CreateEventPage from "../features/events/CreateEventPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<EventsListPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
        <Route path="/organizer/events" element={<MyEventsPage />} />
        <Route path="/organizer/events/new" element={<CreateEventPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-6">404 - Page not found</div>} />
    </Routes>
  );
}