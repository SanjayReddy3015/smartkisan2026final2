import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function useMarketPrices() {
  return useQuery({
    queryKey: [api.marketPrices.list.path],
    queryFn: async () => {
      const res = await fetch(api.marketPrices.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch market prices");
      return await res.json();
    },
    refetchInterval: 5 * 60 * 1000, // auto-refresh every 5 minutes
  });
}

export function usePriceHistory(crop?: string, state?: string, days = 60) {
  const params = new URLSearchParams();
  if (crop) params.set("crop", crop);
  if (state) params.set("state", state);
  params.set("days", String(days));

  return useQuery({
    queryKey: [api.priceHistory.byCrop.path, crop, state, days],
    queryFn: async () => {
      const res = await fetch(`${api.priceHistory.byCrop.path}?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch price history");
      return await res.json() as Array<{
        id: number;
        crop: string;
        state: string;
        market: string;
        variety: string | null;
        minPrice: number;
        maxPrice: number;
        modalPrice: number;
        recordDate: string;
      }>;
    },
    enabled: !!crop,
  });
}

export function useRefreshPrices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", api.marketPrices.refresh.path);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.marketPrices.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.priceHistory.byCrop.path] });
    },
  });
}
