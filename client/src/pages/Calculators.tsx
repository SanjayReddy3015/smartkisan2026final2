import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useIrrigationCalc, useFertilizerCalc, useYieldCalc } from "@/hooks/use-ai";
import { Droplets, Leaf, Calculator, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Calculators() {
  const irrigation = useIrrigationCalc();
  const fertilizer = useFertilizerCalc();
  const yieldCalc = useYieldCalc();

  const [irrigationResult, setIrrigationResult] = useState<any>(null);
  const [fertilizerResult, setFertilizerResult] = useState<any>(null);
  const [yieldResult, setYieldResult] = useState<any>(null);

  const onSubmitIrrigation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      cropType: fd.get("cropType") as string,
      soilType: fd.get("soilType") as string,
      temperature: Number(fd.get("temperature")),
    };
    irrigation.mutate(data, {
      onSuccess: (res) => setIrrigationResult(res)
    });
  };

  const onSubmitFertilizer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      cropType: fd.get("cropType") as string,
      soilType: fd.get("soilType") as string,
      stage: fd.get("stage") as string,
    };
    fertilizer.mutate(data, {
      onSuccess: (res) => setFertilizerResult(res)
    });
  };

  const onSubmitYield = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      cropType: fd.get("cropType") as string,
      acres: Number(fd.get("acres")),
      expectedPrice: Number(fd.get("expectedPrice")),
    };
    yieldCalc.mutate(data, {
      onSuccess: (res) => setYieldResult(res)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">AI Calculators</h1>
        <p className="text-muted-foreground mt-2">Data-driven insights for your farm</p>
      </div>

      <Tabs defaultValue="irrigation" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 w-full max-w-2xl bg-muted/50 p-1">
          <TabsTrigger value="irrigation" className="data-[state=active]:bg-white data-[state=active]:text-primary">
            <Droplets className="w-4 h-4 mr-2" /> Irrigation
          </TabsTrigger>
          <TabsTrigger value="fertilizer" className="data-[state=active]:bg-white data-[state=active]:text-primary">
            <Leaf className="w-4 h-4 mr-2" /> Fertilizer
          </TabsTrigger>
          <TabsTrigger value="yield" className="data-[state=active]:bg-white data-[state=active]:text-primary">
            <Calculator className="w-4 h-4 mr-2" /> Yield & Profit
          </TabsTrigger>
        </TabsList>

        <div className="max-w-2xl">
          <TabsContent value="irrigation">
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle>Smart Irrigation Needs</CardTitle>
                <CardDescription>Get tailored watering schedules based on soil and weather.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmitIrrigation} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crop1">Crop Type</Label>
                      <Input id="crop1" name="cropType" placeholder="e.g. Wheat" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="soil1">Soil Type</Label>
                      <Input id="soil1" name="soilType" placeholder="e.g. Clay, Sandy" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temp">Current Temperature (°C)</Label>
                    <Input id="temp" name="temperature" type="number" placeholder="30" required />
                  </div>
                  <Button type="submit" className="w-full hover-elevate" disabled={irrigation.isPending}>
                    {irrigation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Calculate Water Needs
                  </Button>
                </form>

                {irrigationResult && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <h4 className="font-bold text-blue-900 mb-2">Recommendation</h4>
                    <p className="text-blue-800 text-sm">{irrigationResult.recommendation}</p>
                    <div className="mt-3 inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      <Droplets className="w-4 h-4 mr-1" />
                      {irrigationResult.waterLitersPerAcre} Liters / Acre
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fertilizer">
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle>Fertilizer Optimizer</CardTitle>
                <CardDescription>Know exactly what nutrients your crop needs right now.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmitFertilizer} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crop2">Crop Type</Label>
                      <Input id="crop2" name="cropType" placeholder="e.g. Rice" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="soil2">Soil Type</Label>
                      <Input id="soil2" name="soilType" placeholder="e.g. Loamy" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Growth Stage</Label>
                    <Input id="stage" name="stage" placeholder="e.g. Seedling, Flowering" required />
                  </div>
                  <Button type="submit" className="w-full hover-elevate bg-green-600 hover:bg-green-700" disabled={fertilizer.isPending}>
                    {fertilizer.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Get Recommendation
                  </Button>
                </form>

                {fertilizerResult && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <h4 className="font-bold text-green-900 mb-2">AI Analysis</h4>
                    <p className="text-green-800 text-sm leading-relaxed">{fertilizerResult.recommendation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yield">
            <Card className="shadow-lg border-primary/10">
              <CardHeader>
                <CardTitle>Yield & Profit Estimator</CardTitle>
                <CardDescription>Forecast your harvest value before the season ends.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmitYield} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop3">Crop Type</Label>
                    <Input id="crop3" name="cropType" placeholder="e.g. Cotton" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="acres">Acres Planted</Label>
                      <Input id="acres" name="acres" type="number" step="0.1" placeholder="5" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Expected Price (₹/Quintal)</Label>
                      <Input id="price" name="expectedPrice" type="number" placeholder="6000" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full hover-elevate bg-accent hover:bg-accent/90" disabled={yieldCalc.isPending}>
                    {yieldCalc.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Calculate Profit
                  </Button>
                </form>

                {yieldResult && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 border rounded-xl text-center">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Est. Yield</p>
                      <p className="text-2xl font-black text-foreground">{yieldResult.estimatedYieldQuintals} <span className="text-sm font-normal text-muted-foreground">Quintals</span></p>
                    </div>
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-center">
                      <p className="text-xs text-orange-600/80 font-semibold uppercase tracking-wider mb-1">Gross Profit</p>
                      <p className="text-2xl font-black text-accent">₹{yieldResult.estimatedProfit.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
