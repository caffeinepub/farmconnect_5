import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  CloudSun,
  Droplets,
  Plane,
  Thermometer,
  Tractor,
  TrendingUp,
  Users,
  Wind,
} from "lucide-react";
import { mockCropPrices, mockWeather } from "../data/mockData";
import {
  useAllCropPrices,
  useCallerUserProfile,
  useWeatherData,
} from "../hooks/useQueries";

const quickActions = [
  {
    to: "/tractors",
    label: "Book Tractor",
    desc: "Plough & cultivate",
    icon: Tractor,
    color: "from-green-500 to-green-700",
    ocid: "dashboard.tractor_button",
    emoji: "🚜",
  },
  {
    to: "/labours",
    label: "Book Labour",
    desc: "Harvest & sow",
    icon: Users,
    color: "from-amber-500 to-amber-700",
    ocid: "dashboard.labour_button",
    emoji: "👨‍🌾",
  },
  {
    to: "/drones",
    label: "Book Drone",
    desc: "Spray & survey",
    icon: Plane,
    color: "from-blue-500 to-blue-700",
    ocid: "dashboard.drone_button",
    emoji: "🚁",
  },
  {
    to: "/my-bookings",
    label: "My Bookings",
    desc: "View all bookings",
    icon: BookOpen,
    color: "from-purple-500 to-purple-700",
    ocid: "dashboard.bookings_button",
    emoji: "📋",
  },
];

function getWeatherEmoji(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes("sun") || c.includes("clear")) return "☀️";
  if (c.includes("partly")) return "⛅";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("rain") || c.includes("shower")) return "🌧️";
  if (c.includes("storm") || c.includes("thunder")) return "⛈️";
  if (c.includes("fog") || c.includes("mist")) return "🌫️";
  return "🌤️";
}

export function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];
  const { data: weatherData, isLoading: weatherLoading } =
    useWeatherData(today);
  const { data: cropPrices, isLoading: pricesLoading } = useAllCropPrices();
  const { data: profile } = useCallerUserProfile();

  const weather = weatherData || mockWeather;
  const prices =
    cropPrices && cropPrices.length > 0 ? cropPrices : mockCropPrices;
  const top5Crops = prices.slice(0, 5);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Banner */}
      <div className="farm-gradient px-4 pt-6 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-6xl">🌾</div>
          <div className="absolute bottom-4 left-4 text-5xl">🌿</div>
          <div className="absolute top-12 left-1/2 text-4xl">🌱</div>
        </div>
        <div className="relative max-w-lg mx-auto">
          <p className="text-white/70 text-sm font-medium">{todayFormatted}</p>
          <h1 className="font-display font-bold text-2xl text-white mt-1">
            {greeting()}, {profile?.name || "Farmer"} 👋
          </h1>
          <p className="text-white/80 text-sm mt-1">
            What do you need help with today?
          </p>
        </div>
      </div>

      <div className="px-4 -mt-8 max-w-lg mx-auto space-y-5">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ to, label, desc, color, ocid, emoji }) => (
            <Link key={to} to={to} data-ocid={ocid}>
              <Card className="overflow-hidden card-hover border-border h-full">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${color} p-4`}>
                    <span className="text-3xl">{emoji}</span>
                  </div>
                  <div className="p-3">
                    <p className="font-display font-bold text-sm text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Weather Card */}
        <Card className="border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="farm-gradient p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs font-medium">
                    Today's Weather
                  </p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-4xl">
                      {getWeatherEmoji(weather.condition)}
                    </span>
                    <div>
                      <span className="font-display font-bold text-3xl text-white">
                        {weather.temperature}°C
                      </span>
                      <p className="text-white/80 text-sm">
                        {weather.condition}
                      </p>
                    </div>
                  </div>
                </div>
                <Link to="/weather">
                  <Badge
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 cursor-pointer"
                  >
                    Details <ChevronRight className="h-3 w-3 ml-1" />
                  </Badge>
                </Link>
              </div>
            </div>
            {weatherLoading ? (
              <div className="p-4 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="p-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <Droplets className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                  <p className="font-bold text-sm text-foreground">
                    {weather.humidity}%
                  </p>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </div>
                <div className="text-center">
                  <Wind className="h-4 w-4 text-cyan-500 mx-auto mb-1" />
                  <p className="font-bold text-sm text-foreground">
                    {weather.windSpeed} km/h
                  </p>
                  <p className="text-xs text-muted-foreground">Wind</p>
                </div>
                <div className="text-center">
                  <CloudSun className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                  <p className="font-bold text-sm text-foreground">
                    {weather.rainfall} mm
                  </p>
                  <p className="text-xs text-muted-foreground">Rainfall</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crop Prices */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-display font-bold text-foreground">
                  Today's Crop Prices
                </h2>
              </div>
              <Link to="/crop-prices">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted transition-colors text-xs"
                >
                  View All <ChevronRight className="h-3 w-3 ml-0.5" />
                </Badge>
              </Link>
            </div>

            {pricesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {top5Crops.map((crop, i) => (
                  <div
                    key={`${crop.cropName}-${i}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {crop.cropName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {crop.marketName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        ₹{crop.pricePerQuintal.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /{crop.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distance Note */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-3">
          <span className="text-xl mt-0.5">📍</span>
          <div>
            <p className="font-semibold text-sm text-foreground">
              25 km Radius Booking
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              All resources listed are within 25 km of your location. Set your
              location in Profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
