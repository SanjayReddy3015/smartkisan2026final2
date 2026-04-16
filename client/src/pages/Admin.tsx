import { useState } from "react";
import { useVerifyOtp } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2, LayoutDashboard, Users, LineChart } from "lucide-react";
import { useFarmers } from "@/hooks/use-farmers";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const verifyOtp = useVerifyOtp();
  const { data: farmers } = useFarmers();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await verifyOtp.mutateAsync({
        phone: fd.get("phone") as string,
        otp: fd.get("otp") as string,
      });
      if (res.success) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Error handled by hook toast
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif">Admin Portal</CardTitle>
            <CardDescription>Enter your phone and OTP to access dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="Admin phone number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input id="otp" name="otp" type="password" placeholder="Enter 6-digit OTP" required />
              </div>
              <Button type="submit" className="w-full hover-elevate mt-4" disabled={verifyOtp.isPending}>
                {verifyOtp.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Secure Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" /> 
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Manage platform data and monitor activity.</p>
        </div>
        <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Farmers</p>
                <h3 className="text-3xl font-bold">{farmers?.length || 0}</h3>
              </div>
              <Users className="w-5 h-5 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-accent shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Queries</p>
                <h3 className="text-3xl font-bold">12</h3>
              </div>
              <LineChart className="w-5 h-5 text-accent/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-md">
        <CardHeader className="bg-muted/10 border-b">
          <CardTitle>System Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-xl">
            Admin management grid goes here. Data systems operational.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
