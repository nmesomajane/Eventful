import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  PlusCircle,
  Ticket,
  LogOut,
  LayoutGrid,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const HIDDEN_ON = ["/login", "/signup"];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (HIDDEN_ON.includes(location.pathname)) {
    console.log("[Navbar] hidden on auth route:", location.pathname);
    return null;
  }

  const handleLogout = async () => {
    console.log("[Navbar] logging out");
    setMobileOpen(false);
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive(path) ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
    }`;

  // Same styling, but full-width and larger tap targets for the mobile dropdown
  const mobileLinkClass = (path: string) =>
    `flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive(path) ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
    }`;

  const navLinks = (
    <>
      <Link to="/dashboard" className={linkClass("/dashboard")} onClick={() => setMobileOpen(false)}>
        <LayoutGrid className="h-4 w-4" /> Browse
      </Link>

      {user?.role === "attendee" && (
        <Link to="/my-tickets" className={linkClass("/my-tickets")} onClick={() => setMobileOpen(false)}>
          <Ticket className="h-4 w-4" /> My Tickets
        </Link>
      )}

      {user?.role === "organizer" && (
        <>
          <Link to="/organizer/events" className={linkClass("/organizer/events")} onClick={() => setMobileOpen(false)}>
            <Calendar className="h-4 w-4" /> My Events
          </Link>
          <Link
            to="/organizer/events/new"
            className={linkClass("/organizer/events/new")}
            onClick={() => setMobileOpen(false)}
          >
            <PlusCircle className="h-4 w-4" /> Create Event
          </Link>
          <Link
            to="/organizer/analytics"
            className={linkClass("/organizer/analytics")}
            onClick={() => setMobileOpen(false)}
          >
            <BarChart3 className="h-4 w-4" /> Analytics
          </Link>
        </>
      )}
    </>
  );

  const mobileNavLinks = (
    <>
      <Link to="/dashboard" className={mobileLinkClass("/dashboard")} onClick={() => setMobileOpen(false)}>
        <LayoutGrid className="h-4 w-4" /> Browse
      </Link>

      {user?.role === "attendee" && (
        <Link to="/my-tickets" className={mobileLinkClass("/my-tickets")} onClick={() => setMobileOpen(false)}>
          <Ticket className="h-4 w-4" /> My Tickets
        </Link>
      )}

      {user?.role === "organizer" && (
        <>
          <Link
            to="/organizer/events"
            className={mobileLinkClass("/organizer/events")}
            onClick={() => setMobileOpen(false)}
          >
            <Calendar className="h-4 w-4" /> My Events
          </Link>
          <Link
            to="/organizer/events/new"
            className={mobileLinkClass("/organizer/events/new")}
            onClick={() => setMobileOpen(false)}
          >
            <PlusCircle className="h-4 w-4" /> Create Event
          </Link>
          <Link
            to="/organizer/analytics"
            className={mobileLinkClass("/organizer/analytics")}
            onClick={() => setMobileOpen(false)}
          >
            <BarChart3 className="h-4 w-4" /> Analytics
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-20 bg-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-bold text-blue-600" onClick={() => setMobileOpen(false)}>
          Eventful
        </Link>

        {/* Desktop nav — hidden below md */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks}
          <button
            onClick={handleLogout}
            className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* Mobile hamburger toggle — hidden at md and up */}
        <button
          onClick={() => {
            console.log("[Navbar] toggling mobile menu:", !mobileOpen);
            setMobileOpen((prev) => !prev);
          }}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {mobileNavLinks}
            <button
              onClick={handleLogout}
              className="mt-1 flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}