import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type ChatInput = z.infer<typeof api.ai.chat.input>;
type IrrigationInput = z.infer<typeof api.ai.irrigationCalc.input>;
type FertilizerInput = z.infer<typeof api.ai.fertilizerCalc.input>;
type YieldInput = z.infer<typeof api.ai.yieldCalc.input>;

export function useAiChat() {
  return useMutation({
    mutationFn: async (data: ChatInput) => {
      const validated = api.ai.chat.input.parse(data);
      const res = await fetch(api.ai.chat.path, {
        method: api.ai.chat.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to get AI response");
      return api.ai.chat.responses[200].parse(await res.json());
    }
  });
}

export function useIrrigationCalc() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: IrrigationInput) => {
      const validated = api.ai.irrigationCalc.input.parse(data);
      const res = await fetch(api.ai.irrigationCalc.path, {
        method: api.ai.irrigationCalc.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to calculate irrigation");
      return api.ai.irrigationCalc.responses[200].parse(await res.json());
    },
    onError: () => toast({ title: "Error", description: "Could not calculate irrigation requirements", variant: "destructive" })
  });
}

export function useFertilizerCalc() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: FertilizerInput) => {
      const validated = api.ai.fertilizerCalc.input.parse(data);
      const res = await fetch(api.ai.fertilizerCalc.path, {
        method: api.ai.fertilizerCalc.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to get fertilizer recommendation");
      return api.ai.fertilizerCalc.responses[200].parse(await res.json());
    },
    onError: () => toast({ title: "Error", description: "Could not get recommendation", variant: "destructive" })
  });
}

export function useYieldCalc() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: YieldInput) => {
      const validated = api.ai.yieldCalc.input.parse(data);
      const res = await fetch(api.ai.yieldCalc.path, {
        method: api.ai.yieldCalc.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to estimate yield");
      return api.ai.yieldCalc.responses[200].parse(await res.json());
    },
    onError: () => toast({ title: "Error", description: "Could not calculate yield", variant: "destructive" })
  });
}
