import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "../features/auth/SignUpPage";
import LoginPage from "../features/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<div className="p-6">Dashboard (placeholder)</div>} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-6">404 - Page not found</div>} />
    </Routes>
  );
}