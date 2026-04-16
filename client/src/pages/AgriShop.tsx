import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info, ShieldCheck, ShoppingCart, Search, ArrowDownUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";

export default function AgriShop() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");

    const { data: products, isLoading } = useQuery({
        queryKey: ["/api/products"],
        queryFn: async () => {
            const res = await fetch(api.products.list.path);
            return res.json();
        }
    });

    const categories = ["All", "Seeds", "Fertilizers", "Pesticides", "Tools"];

    const processedProducts = useMemo(() => {
        if (!products) return [];
        let filtered = products;

        if (selectedCategory !== "All") {
            filtered = filtered.filter((p: any) => p.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter((p: any) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a: any, b: any) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "name-asc") return a.name.localeCompare(b.name);
            if (sortBy === "name-desc") return b.name.localeCompare(a.name);
            return 0; // default
        });
    }, [products, selectedCategory, searchQuery, sortBy]);

    const handleForceSeed = async () => {
        await fetch("/api/admin/force-seed");
        window.location.reload();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16 pt-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-8 shadow-sm border border-green-200/50">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-green-900 mb-2">Smart Kisan <span className="text-emerald-600">Shop</span></h1>
                    <p className="text-green-800/80 text-lg max-w-xl">Curated authentic seeds, organic fertilizers, and premium machinery delivered directly to your farm.</p>
                </div>
                <div className="mt-6 md:mt-0 flex gap-3">
                    <Button variant="outline" className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-sm rounded-full px-6" onClick={handleForceSeed}>
                        Reload Local Items
                    </Button>
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-full px-6">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Cart (0)</span>
                    </Button>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 overflow-x-auto w-full lg:w-auto">
                    {categories.map(c => (
                        <Button
                            key={c}
                            variant={selectedCategory === c ? "default" : "secondary"}
                            onClick={() => setSelectedCategory(c)}
                            className={`rounded-full px-6 transition-all duration-300 ${selectedCategory === c ? "bg-emerald-600 shadow-md text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                        >
                            {c}
                        </Button>
                    ))}
                </div>

                <div className="flex w-full lg:w-auto items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="🔍 Search products..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full lg:w-[250px] bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-full focus:ring-emerald-500 focus:border-emerald-500 block pl-10 p-2.5 transition-all outline-none"
                        />
                    </div>
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500/50">
                        <ArrowDownUp className="h-4 w-4 text-emerald-600 mr-2" />
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="bg-transparent border-none text-sm text-slate-700 focus:outline-none cursor-pointer pr-4 appearance-none font-medium"
                            style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                        >
                            <option value="default">Sort by: Recommended</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A-Z</option>
                            <option value="name-desc">Name: Z-A</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {processedProducts?.map((product: any, idx: number) => (
                    <Card key={product.id} className="group overflow-hidden bg-white border border-slate-200/60 shadow-sm flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 rounded-2xl">
                        <div className="h-[240px] relative flex items-center justify-center bg-slate-100 overflow-hidden">
                            {/* Gradient Overlay for Image Text clarity */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                            />

                            <Badge className="absolute top-4 left-4 bg-white/95 text-emerald-700 hover:bg-white border-none backdrop-blur-md shadow-lg font-bold tracking-wide rounded-full px-4 py-1 z-20">
                                {product.category}
                            </Badge>

                            <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <span className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-full shadow-lg text-sm">
                                    Trusted Vendor
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-6 flex-1 flex flex-col gap-4">
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="font-bold text-lg leading-snug text-slate-800 line-clamp-2">{product.name}</h3>
                                <p className="font-extrabold text-2xl text-emerald-600 mt-1 whitespace-nowrap bg-emerald-50 px-3 py-1 rounded-lg">₹{product.price.toLocaleString()}</p>
                            </div>

                            <p className="text-sm text-slate-600 border-b border-slate-100 pb-4 line-clamp-3">{product.description}</p>

                            <div className="mt-2 space-y-3">
                                <div className="group/item">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Info className="h-3.5 w-3.5 text-blue-500" /> How to Use
                                    </p>
                                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed group-hover/item:border-blue-200 group-hover/item:bg-blue-50/30 transition-colors">
                                        {product.usage}
                                    </p>
                                </div>
                                <div className="group/item">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Core Benefits
                                    </p>
                                    <p className="text-sm text-emerald-800 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 font-medium leading-relaxed group-hover/item:bg-emerald-50 transition-colors">
                                        {product.benefits}
                                    </p>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-6 pt-0 mt-auto">
                            <Button
                                className="w-full gap-2 font-bold bg-slate-900 hover:bg-emerald-600 text-white shadow-md rounded-xl py-6 transition-all duration-300"
                                onClick={() => window.open(product.buyUrl, "_blank")}
                            >
                                <ShoppingCart className="h-5 w-5" /> Buy on External Retailer
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {isLoading && (
                    <div className="col-span-full py-20 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                )}

                {!isLoading && processedProducts?.length === 0 && (
                    <div className="col-span-full flex flex-col text-center py-24 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 mt-6">
                        <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-700 mb-2">No items found</h3>
                        <p className="text-slate-500">We couldn't find any products matching your current filters.</p>
                        <Button
                            variant="outline"
                            className="mx-auto mt-6 rounded-full border-slate-300"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSortBy("default"); }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
