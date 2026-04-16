import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertFarmer } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFarmers() {
  return useQuery({
    queryKey: [api.farmers.list.path],
    queryFn: async () => {
      const res = await fetch(api.farmers.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch farmers");
      const data = await res.json();
      return api.farmers.list.responses[200].parse(data);
    },
  });
}

export function useCreateFarmer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertFarmer) => {
      const validated = api.farmers.create.input.parse(data);
      const res = await fetch(api.farmers.create.path, {
        method: api.farmers.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.farmers.create.responses[400].parse(await res.json());
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create farmer");
      }
      return api.farmers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.farmers.list.path] });
      toast({
        title: "Farmer Registered",
        description: "The profile has been created successfully.",
      });
    },
    onError: (err) => {
      toast({
        title: "Registration Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}
