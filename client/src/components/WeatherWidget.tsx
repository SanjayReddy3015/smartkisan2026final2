import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/use-weather";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSun, MapPin, Sun, Thermometer, Loader2 } from "lucide-react";

export function WeatherWidget() {
  const [coords, setCoords] = useState<{lat: string, lng: string} | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
          });
        },
        (err) => {
          setGeoError("Location access denied. Using default.");
          // Fallback to a default central location
          setCoords({ lat: "20.5937", lng: "78.9629" }); 
        }
      );
    } else {
      setCoords({ lat: "20.5937", lng: "78.9629" });
    }
  }, []);

  const { data: weather, isLoading } = useWeather(coords);

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (c.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-400" />;
    if (c.includes('partly')) return <CloudSun className="w-8 h-8 text-yellow-500" />;
    return <Sun className="w-8 h-8 text-orange-500" />;
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-none hover-elevate">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
          <CloudSun className="w-5 h-5" /> Local Weather
        </h3>
        
        {!coords || isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Fetching location data...</p>
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" /> {weather.location}
              </div>
              <div className="text-4xl font-black text-foreground flex items-start">
                {Math.round(weather.temp)}<span className="text-xl mt-1">°C</span>
              </div>
              <div className="text-sm font-medium capitalize text-primary/80 mt-1">
                {weather.condition}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {getWeatherIcon(weather.condition)}
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-white/50 px-2 py-1 rounded-full">
                💧 {weather.humidity}% Hum
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-destructive py-4">Failed to load weather data.</div>
        )}
      </CardContent>
    </Card>
  );
}
