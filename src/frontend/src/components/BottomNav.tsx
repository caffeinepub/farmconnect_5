import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Home, Plane, Tractor, Users } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home, ocid: "nav.home_link" },
  {
    to: "/tractors",
    label: "Tractors",
    icon: Tractor,
    ocid: "nav.tractors_link",
  },
  { to: "/labours", label: "Labour", icon: Users, ocid: "nav.labours_link" },
  { to: "/drones", label: "Drones", icon: Plane, ocid: "nav.drones_link" },
  {
    to: "/my-bookings",
    label: "Bookings",
    icon: BookOpen,
    ocid: "nav.bookings_link",
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map(({ to, label, icon: Icon, ocid }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`}
              />
              <span className="text-[10px] font-semibold leading-tight">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
