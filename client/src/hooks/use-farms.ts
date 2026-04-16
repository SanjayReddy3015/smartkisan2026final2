import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertFarm } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFarms() {
  return useQuery({
    queryKey: [api.farms.list.path],
    queryFn: async () => {
      const res = await fetch(api.farms.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch farms");
      const data = await res.json();
      return api.farms.list.responses[200].parse(data);
    },
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertFarm) => {
      const validated = api.farms.create.input.parse(data);
      const res = await fetch(api.farms.create.path, {
        method: api.farms.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.farms.create.responses[400].parse(await res.json());
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create farm");
      }
      return api.farms.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.farms.list.path] });
      toast({
        title: "Farm Added",
        description: "The farm details have been saved.",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to Add Farm",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}
