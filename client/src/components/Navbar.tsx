import { Link, useNavigate, useLocation } from "react-router-dom";
import { Calendar, PlusCircle, Ticket, LogOut, LayoutGrid } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const HIDDEN_ON = ["/login", "/signup"];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

    if (HIDDEN_ON.includes(location.pathname)) {
    console.log("[Navbar] hidden on auth route:", location.pathname);
    return null;
  }

  const handleLogout = async () => {
    console.log("[Navbar] logging out");
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive(path) ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-bold text-blue-600">
          Eventful
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <LayoutGrid className="h-4 w-4" /> Browse
          </Link>

          {user?.role === "attendee" && (
            <Link to="/my-tickets" className={linkClass("/my-tickets")}>
              <Ticket className="h-4 w-4" /> My Tickets
            </Link>
          )}

          {user?.role === "organizer" && (
            <>
              <Link to="/organizer/events" className={linkClass("/organizer/events")}>
                <Calendar className="h-4 w-4" /> My Events
              </Link>
              <Link to="/organizer/events/new" className={linkClass("/organizer/events/new")}>
                <PlusCircle className="h-4 w-4" /> Create Event
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}