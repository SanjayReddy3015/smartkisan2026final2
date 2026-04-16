import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CloudRain, Thermometer, Wind, Droplets, AlertTriangle, Shield, Info, Loader2, RefreshCw, Bug, Snowflake, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CROPS = ["Wheat", "Rice/Paddy", "Cotton", "Soyabean", "Onion", "Tomato", "Potato", "Sugarcane", "Maize", "Chilli", "Turmeric"];

type WeatherData = {
  temp: number;
  humidity: number;
  rain: number;
  windspeed: number;
  condition: string;
  weatherCode: number;
  location: string;
  forecast: { date: string; maxTemp: number; minTemp: number; rain: number; windMax: number }[];
};

function getAlerts(weather: WeatherData) {
  const alerts: { type: "danger" | "warning" | "info"; icon: any; title: string; desc: string }[] = [];
  if (weather.rain > 10 || weather.weatherCode >= 80) {
    alerts.push({ type: "danger", icon: CloudRain, title: "Heavy Rain Alert", desc: "Heavy rainfall expected. Harvest ready crops immediately. Ensure proper drainage in fields. Avoid spraying pesticides or fertilizers." });
  } else if (weather.rain > 3 || weather.weatherCode >= 61) {
    alerts.push({ type: "warning", icon: CloudRain, title: "Rain Alert", desc: "Moderate rain likely. Delay irrigation today. Check for waterlogging in low-lying fields." });
  }
  if (weather.temp <= 5) {
    alerts.push({ type: "danger", icon: Snowflake, title: "Frost Warning", desc: "Frost conditions! Cover sensitive crops overnight. Use smoke/fire to protect orchards. Irrigate before frost to protect root zone." });
  } else if (weather.temp <= 10) {
    alerts.push({ type: "warning", icon: Snowflake, title: "Cold Wave Alert", desc: "Cold wave expected. Protect seedlings with mulch. Delay transplanting operations." });
  }
  if (weather.temp >= 42) {
    alerts.push({ type: "danger", icon: Flame, title: "Heatwave Warning", desc: "Extreme heat! Irrigate fields in early morning or evening only. Shade sensitive crops. Workers should avoid noon sun (12-4 PM)." });
  } else if (weather.temp >= 38) {
    alerts.push({ type: "warning", icon: Thermometer, title: "High Temperature Alert", desc: "Very hot weather. Increase irrigation frequency. Mulch to retain soil moisture. Watch for heat stress symptoms." });
  }
  if (weather.humidity >= 85 && weather.temp >= 25) {
    alerts.push({ type: "warning", icon: Bug, title: "Pest/Disease Risk", desc: "High humidity + warm temperature creates ideal conditions for fungal diseases and pest outbreak. Apply preventive fungicide spray." });
  }
  if (weather.windspeed >= 40) {
    alerts.push({ type: "danger", icon: Wind, title: "High Wind Alert", desc: "Strong winds! Do not spray pesticides or fertilizers. Stake tall crops. Check bunds and field borders." });
  }
  if (alerts.length === 0) {
    alerts.push({ type: "info", icon: Shield, title: "Weather Conditions Favorable", desc: "Current weather is suitable for normal farming operations. Good time for sowing, irrigation, or field work." });
  }
  return alerts;
}

function getWeatherIcon(code: number) {
  if (code >= 80) return "⛈";
  if (code >= 61) return "🌧";
  if (code >= 51) return "🌦";
  if (code >= 45) return "🌫";
  if (code >= 3) return "☁";
  if (code >= 1) return "⛅";
  return "☀";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function WeatherAlerts() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [aiAlert, setAiAlert] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setLocationError("Location access denied. Using default weather data.")
    );
  }, []);

  const weatherQuery = useQuery<WeatherData>({
    queryKey: ["/api/weather/live", coords?.lat, coords?.lon],
    queryFn: async () => {
      const url = coords
        ? `/api/weather/live?lat=${coords.lat}&lon=${coords.lon}`
        : "/api/weather/live";
      const res = await fetch(url);
      return res.json();
    },
    refetchInterval: 10 * 60 * 1000,
  });

  const aiAlertMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ai/weather-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop: selectedCrop, weatherData: weatherQuery.data }),
      });
      const data = await res.json();
      return data.alert as string;
    },
    onSuccess: (data) => setAiAlert(data),
  });

  const weather = weatherQuery.data;
  const alerts = weather ? getAlerts(weather) : [];

  const alertColors = {
    danger: "border-red-300 bg-red-50 dark:bg-red-950/30",
    warning: "border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30",
    info: "border-green-300 bg-green-50 dark:bg-green-950/30",
  };
  const alertIconColors = {
    danger: "text-red-600",
    warning: "text-yellow-600",
    info: "text-green-600",
  };
  const badgeVariants = {
    danger: "destructive",
    warning: "secondary",
    info: "outline",
  } as const;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CloudRain className="w-7 h-7 text-primary" /> Weather & Crop Alerts
          </h1>
          <p className="text-muted-foreground mt-1">Real-time hyperlocal weather + AI-powered crop protection alerts</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => weatherQuery.refetch()} disabled={weatherQuery.isFetching} data-testid="button-refresh-weather">
          <RefreshCw className={`w-4 h-4 mr-1 ${weatherQuery.isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {locationError && (
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {weatherQuery.isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : weather ? (
        <>
          {/* Current Weather */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-4xl mb-2">{getWeatherIcon(weather.weatherCode)}</div>
                <p className="text-3xl font-bold text-primary">{weather.temp}°C</p>
                <p className="text-sm text-muted-foreground">{weather.condition}</p>
                <p className="text-xs text-muted-foreground mt-1">{weather.location}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="text-xl font-bold">{weather.humidity}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Wind Speed</p>
                    <p className="text-xl font-bold">{weather.windspeed} km/h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-sky-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rainfall</p>
                    <p className="text-xl font-bold">{weather.rain} mm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-5 h-5 text-primary" /> Active Weather Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className={`p-4 rounded-lg border ${alertColors[alert.type]} flex gap-3`} data-testid={`alert-${i}`}>
                  <alert.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${alertIconColors[alert.type]}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{alert.title}</p>
                      <Badge variant={badgeVariants[alert.type]} className="text-xs">{alert.type.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm leading-relaxed">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Crop-Specific Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-5 h-5 text-primary" /> AI Crop-Specific Advisory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label>Select Your Crop</Label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger className="mt-1" data-testid="select-crop-alert">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => aiAlertMutation.mutate()} disabled={aiAlertMutation.isPending} data-testid="button-get-alert">
                  {aiAlertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  {aiAlertMutation.isPending ? "Analyzing..." : "Get AI Advisory"}
                </Button>
              </div>
              {aiAlert && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-line">{aiAlert}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          {weather.forecast?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {weather.forecast.map((day, i) => (
                    <div key={i} className="p-3 border rounded-lg text-center space-y-1" data-testid={`forecast-${i}`}>
                      <p className="text-xs font-medium text-muted-foreground">{formatDate(day.date)}</p>
                      <p className="text-2xl">{day.rain > 5 ? "🌧" : day.rain > 0 ? "🌦" : "☀"}</p>
                      <p className="text-sm font-bold">{Math.round(day.maxTemp)}°</p>
                      <p className="text-xs text-muted-foreground">{Math.round(day.minTemp)}°</p>
                      {day.rain > 0 && <p className="text-xs text-blue-600">{day.rain.toFixed(1)}mm</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}
