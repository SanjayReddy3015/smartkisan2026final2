import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ThermometerSnowflake, Phone, Navigation } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Dummy data for AC Godowns in India
const MOCK_GODOWNS = [
    { id: 1, name: "FreshCold Storage Hub", state: "Punjab", district: "Ludhiana", capacity: "5000 MT", feature: "Deep Freeze (-18°C)", price: "₹2.50/kg per month", phone: "+91 98765 43210" },
    { id: 2, name: "Kisan Mega Cold Chain", state: "Maharashtra", district: "Nashik", capacity: "12000 MT", feature: "Controlled Atmosphere", price: "₹3.00/kg per month", phone: "+91 98765 54321" },
    { id: 3, name: "AgriSave AC Warehousing", state: "Gujarat", district: "Surat", capacity: "8000 MT", feature: "Multi-Chamber AC", price: "₹2.80/kg per month", phone: "+91 91234 56789" },
    { id: 4, name: "Harit Cold Storage", state: "Uttar Pradesh", district: "Agra", capacity: "15000 MT", feature: "Potato & Apple Specialized", price: "₹2.20/kg per month", phone: "+91 99887 76655" },
    { id: 5, name: "Himalaya Frost Storage", state: "Himachal Pradesh", district: "Shimla", capacity: "3000 MT", feature: "Apple CA Storage", price: "₹4.00/kg per month", phone: "+91 98111 22334" },
    { id: 6, name: "Deccan Cold Logistics", state: "Karnataka", district: "Bangalore", capacity: "10000 MT", feature: "Vegetable Chiller (2°C)", price: "₹3.50/kg per month", phone: "+91 88877 66554" },
];

export default function Godowns() {
    const [search, setSearch] = useState("");

    const filtered = MOCK_GODOWNS.filter(g =>
        g.state.toLowerCase().includes(search.toLowerCase()) ||
        g.district.toLowerCase().includes(search.toLowerCase()) ||
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AC Godowns & Cold Storage</h1>
                    <p className="text-muted-foreground mt-1">Find state-of-the-art cold storages to protect your harvest.</p>
                </div>
            </div>

            <Card className="border-blue-100 shadow-sm bg-white/50 backdrop-blur-md">
                <CardContent className="p-4 sm:p-6">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                        <Input
                            placeholder="Search by state, district, or godown name..."
                            className="pl-10 h-14 text-lg bg-white border-blue-200 focus-visible:ring-blue-500 rounded-xl shadow-inner"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map(godown => (
                    <Card key={godown.id} className="hover-elevate overflow-hidden border border-blue-100/50 shadow-md">
                        <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl text-blue-900">{godown.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1 font-medium text-slate-600">
                                        <MapPin className="h-4 w-4 text-blue-500" /> {godown.district}, {godown.state}
                                    </CardDescription>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 border-none px-3 py-1 shadow-sm font-bold">
                                    {godown.capacity}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-lg p-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Features</p>
                                    <p className="font-medium text-sm flex items-center gap-2 text-indigo-700">
                                        <ThermometerSnowflake className="h-4 w-4" /> {godown.feature}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Pricing Est.</p>
                                    <p className="font-bold text-sm text-slate-800">{godown.price}</p>
                                </div>
                            </div>
                            <div className="mt-5 flex gap-3">
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md font-bold">
                                    <Phone className="h-4 w-4 mr-2" /> Contact via App
                                </Button>
                                <Button variant="outline" className="flex-[0.4] border-blue-200 text-blue-700 hover:bg-blue-50 font-bold">
                                    <Navigation className="h-4 w-4 mr-2" /> Map
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                        <ThermometerSnowflake className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-lg font-medium">No AC Godowns found in {search}.</p>
                        <p className="text-sm">Try searching for a nearby prominent district.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
