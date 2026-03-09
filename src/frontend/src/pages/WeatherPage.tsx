import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudRain, Droplets, Eye, Sun, Thermometer, Wind } from "lucide-react";
import { mockWeather } from "../data/mockData";
import { useWeatherData } from "../hooks/useQueries";

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

function getWeatherAdvice(weather: typeof mockWeather): string[] {
  const advices: string[] = [];
  if (weather.rainfall > 10)
    advices.push("🌧️ Heavy rain expected — avoid spraying today");
  if (weather.windSpeed > 30)
    advices.push("💨 Strong winds — drone operations not recommended");
  if (weather.temperature > 40)
    advices.push("🥵 Extreme heat — schedule field work for early morning");
  if (weather.temperature < 10)
    advices.push("🥶 Cold weather — protect sensitive crops");
  if (weather.humidity > 80)
    advices.push("💧 High humidity — good conditions for transplanting");
  if (weather.humidity < 30)
    advices.push("☀️ Low humidity — ensure adequate irrigation");
  if (advices.length === 0)
    advices.push("✅ Good conditions for field activities today");
  return advices;
}

const weekForecast = [
  { day: "Today", emoji: "⛅", high: 28, low: 20, condition: "Partly Cloudy" },
  { day: "Tomorrow", emoji: "☀️", high: 31, low: 22, condition: "Sunny" },
  { day: "Wed", emoji: "🌧️", high: 26, low: 19, condition: "Light Rain" },
  { day: "Thu", emoji: "⛈️", high: 24, low: 18, condition: "Thunderstorm" },
  { day: "Fri", emoji: "🌤️", high: 29, low: 21, condition: "Mostly Clear" },
  { day: "Sat", emoji: "☀️", high: 32, low: 23, condition: "Sunny" },
  { day: "Sun", emoji: "⛅", high: 30, low: 21, condition: "Cloudy" },
];

export function WeatherPage() {
  const today = new Date().toISOString().split("T")[0];
  const { data: weatherData, isLoading } = useWeatherData(today);
  const weather = weatherData || mockWeather;

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const advice = getWeatherAdvice(weather);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="farm-gradient px-4 pt-6 pb-20 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-white/70 text-sm">{todayFormatted}</p>
          {isLoading ? (
            <div className="mt-4 space-y-2 flex flex-col items-center">
              <Skeleton className="h-20 w-20 rounded-full bg-white/20" />
              <Skeleton className="h-10 w-32 bg-white/20 rounded-lg" />
            </div>
          ) : (
            <>
              <div className="text-8xl mt-4 mb-2">
                {getWeatherEmoji(weather.condition)}
              </div>
              <div className="font-display font-bold text-6xl text-white">
                {weather.temperature}°C
              </div>
              <p className="text-white/90 text-lg mt-1 font-semibold">
                {weather.condition}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="px-4 -mt-8 max-w-lg mx-auto space-y-4">
        {/* Detailed stats */}
        <Card className="border-border">
          <CardContent className="p-4">
            <h2 className="font-display font-bold text-foreground mb-3">
              Weather Details
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
                  <Droplets className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-lg text-foreground">
                      {weather.humidity}%
                    </p>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                  </div>
                </div>
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3 flex items-center gap-3">
                  <Wind className="h-6 w-6 text-cyan-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-lg text-foreground">
                      {weather.windSpeed} km/h
                    </p>
                    <p className="text-xs text-muted-foreground">Wind Speed</p>
                  </div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-3">
                  <CloudRain className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-lg text-foreground">
                      {weather.rainfall} mm
                    </p>
                    <p className="text-xs text-muted-foreground">Rainfall</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-3">
                  <Thermometer className="h-6 w-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-lg text-foreground">
                      {weather.temperature}°C
                    </p>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farming advice */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sun className="h-5 w-5 text-farm-amber" />
              <h2 className="font-display font-bold text-foreground">
                Farming Advisory
              </h2>
            </div>
            <div className="space-y-2">
              {advice.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 bg-muted/50 rounded-lg p-2.5"
                >
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 7-day forecast */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-foreground">
                7-Day Forecast
              </h2>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekForecast.map((day, i) => (
                <div
                  key={day.day}
                  className={`flex flex-col items-center p-2 rounded-xl text-center ${
                    i === 0
                      ? "bg-primary/10 ring-1 ring-primary/30"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    {day.day}
                  </p>
                  <span className="text-xl my-1">{day.emoji}</span>
                  <p className="text-xs font-bold text-foreground">
                    {day.high}°
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {day.low}°
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rainfall map placeholder */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4">
          <h3 className="font-display font-bold text-foreground flex items-center gap-2">
            <span>🗺️</span> Rainfall Map
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Regional rainfall data for your area shows{" "}
            {weather.rainfall > 0 ? "active precipitation" : "dry conditions"}{" "}
            today. Plan irrigation and field activities accordingly.
          </p>
        </div>
      </div>
    </div>
  );
}
