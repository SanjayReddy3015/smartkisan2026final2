import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

interface Coordinates {
  lat?: string;
  lng?: string;
}

export function useWeather(coords: Coordinates | null) {
  return useQuery({
    queryKey: [api.weather.get.path, coords?.lat, coords?.lng],
    queryFn: async () => {
      if (!coords) return null;
      
      const searchParams = new URLSearchParams();
      if (coords.lat) searchParams.append("lat", coords.lat);
      if (coords.lng) searchParams.append("lng", coords.lng);
      
      const url = `${api.weather.get.path}?${searchParams.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      return api.weather.get.responses[200].parse(data);
    },
    enabled: !!coords && (!!coords.lat || !!coords.lng),
  });
}
