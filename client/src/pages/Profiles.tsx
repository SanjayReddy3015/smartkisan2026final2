import { useFarmers, useCreateFarmer, useFarms, useCreateFarm } from "@/hooks/use-farmers";
// Quick workaround for separate hooks file importing
import { useFarms as useFarmsList, useCreateFarm as useCreateFarmMutation } from "@/hooks/use-farms";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Plus, User, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function Profiles() {
  const { data: farmers, isLoading: farmersLoading } = useFarmers();
  const { data: farms, isLoading: farmsLoading } = useFarmsList();
  
  const createFarmer = useCreateFarmer();
  const createFarm = useCreateFarmMutation();

  const [farmerOpen, setFarmerOpen] = useState(false);
  const [farmOpen, setFarmOpen] = useState(false);

  const handleFarmerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createFarmer.mutateAsync({
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
      languagePreference: "en",
    });
    setFarmerOpen(false);
  };

  const handleFarmSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createFarm.mutateAsync({
      farmerId: Number(fd.get("farmerId")),
      sizeAcres: fd.get("sizeAcres") as string, // schema type numeric
      soilType: fd.get("soilType") as string,
      primaryCrop: fd.get("primaryCrop") as string,
    });
    setFarmOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farmer Profiles</h1>
          <p className="text-muted-foreground mt-2">Manage farmers and their lands</p>
        </div>
        <Dialog open={farmerOpen} onOpenChange={setFarmerOpen}>
          <DialogTrigger asChild>
            <Button className="hover-elevate shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add Farmer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Farmer</DialogTitle>
              <DialogDescription>Add a profile to connect lands and track yield.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFarmerSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" required placeholder="Ramesh Kumar" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input name="phone" required placeholder="9876543210" />
              </div>
              <Button type="submit" className="w-full" disabled={createFarmer.isPending}>
                {createFarmer.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Profile
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farmers List */}
        <Card className="shadow-lg">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Registered Farmers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {farmersLoading ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : farmers?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No farmers registered yet.</div>
            ) : (
              <div className="divide-y max-h-[400px] overflow-auto">
                {farmers?.map(farmer => (
                  <div key={farmer.id} className="p-4 hover:bg-muted/20 transition-colors flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-foreground">{farmer.name}</h4>
                      <p className="text-xs text-muted-foreground">{farmer.phone}</p>
                    </div>
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                      ID: {farmer.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farms List */}
        <Card className="shadow-lg relative">
          <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" /> Registered Farms
            </CardTitle>
            <Dialog open={farmOpen} onOpenChange={setFarmOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">Add Farm</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Farm Details</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFarmSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Farmer ID</Label>
                    <Input name="farmerId" type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Size (Acres)</Label>
                    <Input name="sizeAcres" type="number" step="0.1" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Soil Type</Label>
                      <Input name="soilType" required placeholder="Black soil" />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Crop</Label>
                      <Input name="primaryCrop" required placeholder="Sugarcane" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={createFarm.isPending}>
                    {createFarm.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Farm
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            {farmsLoading ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : farms?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No farms added yet.</div>
            ) : (
              <div className="divide-y max-h-[400px] overflow-auto">
                {farms?.map(farm => (
                  <div key={farm.id} className="p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">{farm.primaryCrop} Farm</h4>
                      <span className="text-xs font-bold text-accent">{farm.sizeAcres} Acres</span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Farmer ID: {farm.farmerId}</span>
                      <span>•</span>
                      <span>Soil: {farm.soilType}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
