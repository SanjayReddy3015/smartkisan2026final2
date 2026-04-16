import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type VerifyOtpInput = z.infer<typeof api.admin.verifyOtp.input>;

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (data: VerifyOtpInput) => {
      const validated = api.admin.verifyOtp.input.parse(data);
      const res = await fetch(api.admin.verifyOtp.path, {
        method: api.admin.verifyOtp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const err = api.admin.verifyOtp.responses[400].parse(await res.json());
          throw new Error(err.message);
        }
        throw new Error("Failed to verify OTP");
      }
      return api.admin.verifyOtp.responses[200].parse(await res.json());
    }
  });
}
