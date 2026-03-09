import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { CloudSun, Leaf, User } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerUserProfile } from "../hooks/useQueries";
import { useWeatherData } from "../hooks/useQueries";

export function Header() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useCallerUserProfile();
  const today = new Date().toISOString().split("T")[0];
  const { data: weather } = useWeatherData(today);

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : identity
      ? "F"
      : "?";

  const getWeatherEmoji = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("sun") || c.includes("clear")) return "☀️";
    if (c.includes("cloud")) return "⛅";
    if (c.includes("rain")) return "🌧️";
    if (c.includes("storm")) return "⛈️";
    if (c.includes("fog")) return "🌫️";
    return "🌤️";
  };

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 farm-gradient rounded-lg flex items-center justify-center shadow-farm">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            FarmConnect
          </span>
        </Link>

        {/* Weather + Profile */}
        <div className="flex items-center gap-3">
          {weather && (
            <Link
              to="/weather"
              className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-sm"
            >
              <span>{getWeatherEmoji(weather.condition)}</span>
              <span className="font-semibold text-foreground">
                {weather.temperature}°C
              </span>
            </Link>
          )}
          {!weather && (
            <Link
              to="/weather"
              className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-sm"
            >
              <CloudSun className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs">Weather</span>
            </Link>
          )}
          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
              <AvatarFallback className="farm-gradient text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          {!identity && (
            <Link to="/login">
              <div className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold hover:opacity-90 transition-opacity">
                <User className="h-3.5 w-3.5" />
                Login
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
