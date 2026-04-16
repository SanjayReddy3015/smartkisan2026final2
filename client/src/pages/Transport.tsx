import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Truck, MapPin, Package, Calculator, Navigation, Phone, Star, Clock, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ALL_TRANSPORT_SERVICES = [
  // Andhra Pradesh
  { id: 1, state: "Andhra Pradesh", city: "Vijayawada", name: "Vijayawada Agri Transport", type: "Medium Truck (3-6 T)", phone: "9848012345", rating: 4.4, price: "₹1500-2500/trip", available: true },
  { id: 2, state: "Andhra Pradesh", city: "Guntur", name: "Guntur Chilli Logistics", type: "Large Truck (6-10 T)", phone: "9849034567", rating: 4.6, price: "₹2500-4000/trip", available: true },
  { id: 3, state: "Andhra Pradesh", city: "Kurnool", name: "Rayalaseema Transport Co.", type: "Mini Truck (1-3 T)", phone: "9440123456", rating: 4.2, price: "₹800-1500/trip", available: true },
  // Assam
  { id: 4, state: "Assam", city: "Guwahati", name: "Guwahati Cargo Services", type: "Medium Truck (3-6 T)", phone: "9435012345", rating: 4.1, price: "₹1800-3000/trip", available: true },
  { id: 5, state: "Assam", city: "Dibrugarh", name: "Upper Assam Transport", type: "Mini Truck (1-3 T)", phone: "9401234567", rating: 3.9, price: "₹1000-1800/trip", available: true },
  // Bihar
  { id: 6, state: "Bihar", city: "Patna", name: "Patna Kisan Transport", type: "Large Truck (6-10 T)", phone: "9431234567", rating: 4.3, price: "₹2500-4000/trip", available: true },
  { id: 7, state: "Bihar", city: "Muzaffarpur", name: "Muzzafarpur Agri Logistics", type: "Mini Truck (1-3 T)", phone: "9835123456", rating: 4.2, price: "₹700-1200/trip", available: true },
  { id: 8, state: "Bihar", city: "Gaya", name: "Gaya Transport Service", type: "Medium Truck (3-6 T)", phone: "9931234567", rating: 4.0, price: "₹1500-2500/trip", available: false },
  // Chhattisgarh
  { id: 9, state: "Chhattisgarh", city: "Raipur", name: "Raipur Agri Carrier", type: "Medium Truck (3-6 T)", phone: "9302123456", rating: 4.2, price: "₹1500-2800/trip", available: true },
  { id: 10, state: "Chhattisgarh", city: "Bilaspur", name: "CG Truck Network", type: "Mini Truck (1-3 T)", phone: "9303234567", rating: 4.0, price: "₹800-1400/trip", available: true },
  // Delhi / NCR
  { id: 11, state: "Delhi/NCR", city: "Delhi", name: "Capital Agri Transport", type: "Large Truck (6-10 T)", phone: "9811012345", rating: 4.6, price: "₹3000-5000/trip", available: true },
  { id: 12, state: "Delhi/NCR", city: "Noida", name: "NCR Kisan Logistics", type: "Fleet (Multiple)", phone: "9810123456", rating: 4.7, price: "Group rates", available: true },
  // Goa
  { id: 13, state: "Goa", city: "Panaji", name: "Goa Agri Transport", type: "Mini Truck (1-3 T)", phone: "9823012345", rating: 4.1, price: "₹1000-2000/trip", available: true },
  // Gujarat
  { id: 14, state: "Gujarat", city: "Ahmedabad", name: "Ahmedabad Agro Carriers", type: "Large Truck (6-10 T)", phone: "9824012345", rating: 4.6, price: "₹2500-4000/trip", available: true },
  { id: 15, state: "Gujarat", city: "Rajkot", name: "Saurashtra Transport Co.", type: "Medium Truck (3-6 T)", phone: "9825123456", rating: 4.5, price: "₹1500-2500/trip", available: true },
  { id: 16, state: "Gujarat", city: "Surat", name: "South Gujarat Logistics", type: "Fleet (Multiple)", phone: "9726123456", rating: 4.7, price: "Group rates", available: true },
  { id: 17, state: "Gujarat", city: "Unjha", name: "Unjha Spice Transport", type: "Mini Truck (1-3 T)", phone: "9825234567", rating: 4.4, price: "₹800-1500/trip", available: true },
  // Haryana
  { id: 18, state: "Haryana", city: "Karnal", name: "Karnal Grain Carriers", type: "Large Truck (6-10 T)", phone: "9812012345", rating: 4.7, price: "₹2500-4000/trip", available: true },
  { id: 19, state: "Haryana", city: "Hisar", name: "Hisar Cotton Transport", type: "Medium Truck (3-6 T)", phone: "9813123456", rating: 4.4, price: "₹1800-3000/trip", available: true },
  { id: 20, state: "Haryana", city: "Ambala", name: "Ambala Agri Logistics", type: "Mini Truck (1-3 T)", phone: "9896123456", rating: 4.3, price: "₹700-1300/trip", available: true },
  // Himachal Pradesh
  { id: 21, state: "Himachal Pradesh", city: "Shimla", name: "Shimla Apple Transport", type: "Medium Truck (3-6 T)", phone: "9816012345", rating: 4.5, price: "₹2000-3500/trip", available: true },
  { id: 22, state: "Himachal Pradesh", city: "Dharamshala", name: "HP Mountain Carriers", type: "Mini Truck (1-3 T)", phone: "9817123456", rating: 4.3, price: "₹1000-2000/trip", available: true },
  // Jharkhand
  { id: 23, state: "Jharkhand", city: "Ranchi", name: "Jharkhand Agri Transport", type: "Medium Truck (3-6 T)", phone: "9431012345", rating: 4.1, price: "₹1500-2500/trip", available: true },
  // Karnataka
  { id: 24, state: "Karnataka", city: "Bangalore", name: "Bangalore Agri Express", type: "Fleet (Multiple)", phone: "9845012345", rating: 4.7, price: "Group rates", available: true },
  { id: 25, state: "Karnataka", city: "Hubli", name: "Hubli Cotton Carriers", type: "Large Truck (6-10 T)", phone: "9902123456", rating: 4.4, price: "₹2000-3500/trip", available: true },
  { id: 26, state: "Karnataka", city: "Mysore", name: "Mysore Silk & Agri Transport", type: "Medium Truck (3-6 T)", phone: "9886123456", rating: 4.5, price: "₹1500-2500/trip", available: true },
  // Kerala
  { id: 27, state: "Kerala", city: "Kochi", name: "Kochi Spice Logistics", type: "Medium Truck (3-6 T)", phone: "9847012345", rating: 4.5, price: "₹1800-3000/trip", available: true },
  { id: 28, state: "Kerala", city: "Thiruvananthapuram", name: "Capital City Agri Carriers", type: "Mini Truck (1-3 T)", phone: "9846123456", rating: 4.3, price: "₹1000-1800/trip", available: true },
  { id: 29, state: "Kerala", city: "Kozhikode", name: "Malabar Transport Co.", type: "Mini Truck (1-3 T)", phone: "9895123456", rating: 4.2, price: "₹900-1600/trip", available: true },
  // Madhya Pradesh
  { id: 30, state: "Madhya Pradesh", city: "Indore", name: "Indore Soya Logistics", type: "Large Truck (6-10 T)", phone: "9826012345", rating: 4.6, price: "₹2500-4000/trip", available: true },
  { id: 31, state: "Madhya Pradesh", city: "Bhopal", name: "MP Agri Transport Network", type: "Fleet (Multiple)", phone: "9827123456", rating: 4.5, price: "Group rates", available: true },
  { id: 32, state: "Madhya Pradesh", city: "Jabalpur", name: "Mahakoshal Carriers", type: "Medium Truck (3-6 T)", phone: "9425123456", rating: 4.2, price: "₹1500-2500/trip", available: true },
  // Maharashtra
  { id: 33, state: "Maharashtra", city: "Pune", name: "Pune Agri Express", type: "Large Truck (6-10 T)", phone: "9823112345", rating: 4.6, price: "₹2500-4000/trip", available: true },
  { id: 34, state: "Maharashtra", city: "Nashik", name: "Nashik Grape & Onion Transport", type: "Fleet (Multiple)", phone: "9881012345", rating: 4.7, price: "Group rates", available: true },
  { id: 35, state: "Maharashtra", city: "Mumbai", name: "Mumbai Agri Logistics Hub", type: "Fleet (Multiple)", phone: "9820123456", rating: 4.8, price: "Group rates", available: true },
  { id: 36, state: "Maharashtra", city: "Nagpur", name: "Vidarbha Cotton Carriers", type: "Large Truck (6-10 T)", phone: "9823012345", rating: 4.5, price: "₹2000-3500/trip", available: true },
  { id: 37, state: "Maharashtra", city: "Solapur", name: "Solapur Jowar Transport", type: "Medium Truck (3-6 T)", phone: "9822123456", rating: 4.2, price: "₹1500-2500/trip", available: false },
  { id: 38, state: "Maharashtra", city: "Aurangabad", name: "Marathwada Agri Carriers", type: "Medium Truck (3-6 T)", phone: "9823345678", rating: 4.3, price: "₹1600-2800/trip", available: true },
  // Odisha
  { id: 39, state: "Odisha", city: "Bhubaneswar", name: "Odisha Agri Transport", type: "Medium Truck (3-6 T)", phone: "9437012345", rating: 4.2, price: "₹1500-2500/trip", available: true },
  { id: 40, state: "Odisha", city: "Cuttack", name: "Cuttack Paddy Carriers", type: "Mini Truck (1-3 T)", phone: "9438123456", rating: 4.0, price: "₹800-1400/trip", available: true },
  // Punjab
  { id: 41, state: "Punjab", city: "Amritsar", name: "Amritsar Grain Transport", type: "Large Truck (6-10 T)", phone: "9815012345", rating: 4.7, price: "₹2500-4000/trip", available: true },
  { id: 42, state: "Punjab", city: "Ludhiana", name: "Ludhiana Agri Carriers", type: "Fleet (Multiple)", phone: "9814123456", rating: 4.8, price: "Group rates", available: true },
  { id: 43, state: "Punjab", city: "Jalandhar", name: "Doaba Transport Co.", type: "Medium Truck (3-6 T)", phone: "9872123456", rating: 4.5, price: "₹1500-2500/trip", available: true },
  { id: 44, state: "Punjab", city: "Patiala", name: "Malwa Agri Express", type: "Medium Truck (3-6 T)", phone: "9876012345", rating: 4.4, price: "₹1600-2600/trip", available: true },
  // Rajasthan
  { id: 45, state: "Rajasthan", city: "Jaipur", name: "Jaipur Kisan Logistics", type: "Fleet (Multiple)", phone: "9829012345", rating: 4.6, price: "Group rates", available: true },
  { id: 46, state: "Rajasthan", city: "Jodhpur", name: "Marwar Agri Transport", type: "Large Truck (6-10 T)", phone: "9828123456", rating: 4.4, price: "₹2000-3500/trip", available: true },
  { id: 47, state: "Rajasthan", city: "Bikaner", name: "Bikaner Desert Carriers", type: "Medium Truck (3-6 T)", phone: "9414123456", rating: 4.2, price: "₹1500-2500/trip", available: true },
  { id: 48, state: "Rajasthan", city: "Kota", name: "Hadoti Agri Transport", type: "Mini Truck (1-3 T)", phone: "9413234567", rating: 4.1, price: "₹700-1200/trip", available: false },
  // Tamil Nadu
  { id: 49, state: "Tamil Nadu", city: "Chennai", name: "Chennai Agri Express", type: "Fleet (Multiple)", phone: "9841012345", rating: 4.7, price: "Group rates", available: true },
  { id: 50, state: "Tamil Nadu", city: "Coimbatore", name: "Kongu Agri Transport", type: "Large Truck (6-10 T)", phone: "9842123456", rating: 4.5, price: "₹2000-3500/trip", available: true },
  { id: 51, state: "Tamil Nadu", city: "Madurai", name: "Madurai Banana & Veg Transport", type: "Medium Truck (3-6 T)", phone: "9843234567", rating: 4.4, price: "₹1500-2500/trip", available: true },
  { id: 52, state: "Tamil Nadu", city: "Erode", name: "Erode Turmeric Carriers", type: "Mini Truck (1-3 T)", phone: "9790012345", rating: 4.3, price: "₹800-1400/trip", available: true },
  // Telangana
  { id: 53, state: "Telangana", city: "Hyderabad", name: "Hyderabad Agri Logistics Hub", type: "Fleet (Multiple)", phone: "9848112345", rating: 4.7, price: "Group rates", available: true },
  { id: 54, state: "Telangana", city: "Nizamabad", name: "Nizamabad Turmeric Transport", type: "Medium Truck (3-6 T)", phone: "9849234567", rating: 4.5, price: "₹1500-2500/trip", available: true },
  { id: 55, state: "Telangana", city: "Warangal", name: "Kakatiya Agri Carriers", type: "Medium Truck (3-6 T)", phone: "9440234567", rating: 4.3, price: "₹1500-2400/trip", available: true },
  // Uttar Pradesh
  { id: 56, state: "Uttar Pradesh", city: "Lucknow", name: "Lucknow Agri Transport", type: "Fleet (Multiple)", phone: "9415012345", rating: 4.5, price: "Group rates", available: true },
  { id: 57, state: "Uttar Pradesh", city: "Agra", name: "Agra Potato Transport Co.", type: "Large Truck (6-10 T)", phone: "9756012345", rating: 4.4, price: "₹2000-3500/trip", available: true },
  { id: 58, state: "Uttar Pradesh", city: "Kanpur", name: "Kanpur Grain Carriers", type: "Medium Truck (3-6 T)", phone: "9792123456", rating: 4.3, price: "₹1500-2500/trip", available: true },
  { id: 59, state: "Uttar Pradesh", city: "Varanasi", name: "Kashi Agri Express", type: "Medium Truck (3-6 T)", phone: "9415123456", rating: 4.2, price: "₹1400-2300/trip", available: true },
  { id: 60, state: "Uttar Pradesh", city: "Meerut", name: "Meerut Sugarcane Transport", type: "Large Truck (6-10 T)", phone: "9319012345", rating: 4.4, price: "₹2000-3200/trip", available: true },
  // Uttarakhand
  { id: 61, state: "Uttarakhand", city: "Dehradun", name: "Doon Valley Agri Transport", type: "Mini Truck (1-3 T)", phone: "9917012345", rating: 4.3, price: "₹800-1500/trip", available: true },
  { id: 62, state: "Uttarakhand", city: "Haridwar", name: "Haridwar Agri Carriers", type: "Medium Truck (3-6 T)", phone: "9837012345", rating: 4.2, price: "₹1200-2000/trip", available: true },
  // West Bengal
  { id: 63, state: "West Bengal", city: "Kolkata", name: "Kolkata Agri Logistics", type: "Fleet (Multiple)", phone: "9831012345", rating: 4.6, price: "Group rates", available: true },
  { id: 64, state: "West Bengal", city: "Siliguri", name: "Siliguri Tea Transport", type: "Medium Truck (3-6 T)", phone: "9832123456", rating: 4.4, price: "₹1500-2500/trip", available: true },
  { id: 65, state: "West Bengal", city: "Asansol", name: "Barddhaman Agri Carriers", type: "Mini Truck (1-3 T)", phone: "9733012345", rating: 4.1, price: "₹700-1300/trip", available: true },
  // North-East
  { id: 66, state: "Manipur", city: "Imphal", name: "Imphal Agri Transport", type: "Mini Truck (1-3 T)", phone: "9856012345", rating: 4.0, price: "₹800-1500/trip", available: true },
  { id: 67, state: "Meghalaya", city: "Shillong", name: "Shillong Agri Carriers", type: "Mini Truck (1-3 T)", phone: "9863012345", rating: 4.1, price: "₹900-1600/trip", available: true },
  { id: 68, state: "Nagaland", city: "Kohima", name: "Kohima Transport Services", type: "Mini Truck (1-3 T)", phone: "9862012345", rating: 3.9, price: "₹1000-1800/trip", available: true },
  { id: 69, state: "Tripura", city: "Agartala", name: "Tripura Agri Logistics", type: "Mini Truck (1-3 T)", phone: "9436012345", rating: 4.0, price: "₹800-1500/trip", available: true },
  // FPO Networks (All India)
  { id: 70, state: "All India", city: "Pan India", name: "NAFED Logistics Network", type: "Fleet (Multiple)", phone: "1800-112345", rating: 4.8, price: "MSP-linked rates", available: true },
  { id: 71, state: "All India", city: "Pan India", name: "FPO Transport Consortium", type: "Fleet (Multiple)", phone: "1800-KISAN-11", rating: 4.9, price: "Group discount rates", available: true },
];

const STATES = ["All States", ...Array.from(new Set(ALL_TRANSPORT_SERVICES.map(t => t.state))).sort()];
const TRUCK_TYPES = ["All Types", "Mini Truck (1-3 T)", "Medium Truck (3-6 T)", "Large Truck (6-10 T)", "Fleet (Multiple)"];
const CROPS = ["Wheat", "Rice", "Cotton", "Soyabean", "Onion", "Tomato", "Potato", "Sugarcane", "Maize", "Pulses", "Other"];

type EstimateResult = { cost: number; distance: string; tips: string };

export default function Transport() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedType, setSelectedType] = useState("All Types");

  const filtered = ALL_TRANSPORT_SERVICES.filter(svc => {
    const matchState = selectedState === "All States" || svc.state === selectedState;
    const matchType = selectedType === "All Types" || svc.type === selectedType;
    const matchSearch = !search || svc.name.toLowerCase().includes(search.toLowerCase()) || svc.city.toLowerCase().includes(search.toLowerCase()) || svc.state.toLowerCase().includes(search.toLowerCase());
    return matchState && matchType && matchSearch;
  });

  const estimateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/transport/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, cropType, quantity: Number(quantity) }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<EstimateResult>;
    },
    onSuccess: (data) => setEstimate(data),
  });

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !cropType || !quantity) return;
    estimateMutation.mutate();
  };

  const availableCount = filtered.filter(s => s.available).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Truck className="w-7 h-7 text-primary" /> Transport & Logistics — All India
        </h1>
        <p className="text-muted-foreground mt-1">{ALL_TRANSPORT_SERVICES.length} transport services across all Indian states + AI cost estimator</p>
      </div>

      {/* Cost Estimator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="w-5 h-5 text-primary" /> AI Transport Cost Estimator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEstimate} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div className="space-y-1">
              <Label htmlFor="from">From (Village/City)</Label>
              <Input id="from" placeholder="e.g., Nashik, MH" value={from} onChange={e => setFrom(e.target.value)} data-testid="input-from" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="to">To (Mandi/Market)</Label>
              <Input id="to" placeholder="e.g., APMC Pune" value={to} onChange={e => setTo(e.target.value)} data-testid="input-to" />
            </div>
            <div className="space-y-1">
              <Label>Crop Type</Label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger data-testid="select-crop"><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent>{CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="quantity">Quantity (quintals)</Label>
              <Input id="quantity" type="number" placeholder="e.g., 20" value={quantity} onChange={e => setQuantity(e.target.value)} data-testid="input-quantity" />
            </div>
            <Button type="submit" disabled={estimateMutation.isPending || !from || !to || !cropType || !quantity} data-testid="button-estimate">
              {estimateMutation.isPending ? "Calculating..." : "Get AI Estimate"}
            </Button>
          </form>

          {estimate && (
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-semibold">{estimate.distance}</p>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">Estimated Cost</p>
                <p className="text-2xl font-bold text-primary">₹{estimate.cost.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex-2 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">AI Tips:</p>
                <p className="text-sm leading-relaxed">{estimate.tips}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transport Directory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between flex-wrap gap-2 text-base">
            <span className="flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Transport Services Directory</span>
            <span className="text-sm font-normal text-muted-foreground">{availableCount} available of {filtered.length} shown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, city, state..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" data-testid="input-search-transport" />
            </div>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger data-testid="select-state"><SelectValue placeholder="Filter by state" /></SelectTrigger>
              <SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger data-testid="select-truck-type"><SelectValue placeholder="Truck type" /></SelectTrigger>
              <SelectContent>{TRUCK_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(svc => (
              <div key={svc.id} className="p-4 border rounded-lg space-y-3" data-testid={`card-transport-${svc.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{svc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{svc.city}, {svc.state}</p>
                  </div>
                  <Badge variant={svc.available ? "default" : "secondary"} className="text-xs flex-shrink-0 ml-2">
                    {svc.available ? "Available" : "Busy"}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Truck className="w-3 h-3" /> {svc.type}</div>
                  <div className="flex items-center gap-1.5"><Package className="w-3 h-3" /> {svc.price}</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{svc.rating}</span>
                    <span>/ 5.0</span>
                  </div>
                </div>
                <Button size="sm" className="w-full h-8 text-xs" onClick={() => window.open(`tel:${svc.phone}`)} data-testid={`button-call-${svc.id}`}>
                  <Phone className="w-3 h-3 mr-1" /> {svc.phone}
                </Button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No transport services match your filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
