import { useMarketPrices, usePriceHistory, useRefreshPrices } from "@/hooks/use-market-prices";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, RefreshCw, TrendingUp, TrendingDown, Minus,
  BarChart3, ArrowUpRight, ArrowDownRight, Info
} from "lucide-react";
import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend, Area, AreaChart, ReferenceLine
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const CROP_CATEGORIES: Record<string, string[]> = {
  "All": [],
  "Cereals": ["Wheat", "Paddy (Common)", "Paddy (Hybrid)", "Basmati Rice", "Rice", "Maize", "Bajra", "Ragi", "Jowar"],
  "Pulses": ["Arhar Dal", "Moong Dal", "Urad Dal", "Masoor Dal", "Chana (Gram)"],
  "Oilseeds": ["Mustard", "Soyabean", "Groundnut", "Sunflower", "Mustard (Yellow)"],
  "Cash Crops": ["Cotton", "Sugarcane", "Tea", "Rubber", "Jute"],
  "Spices": ["Dry Chilli", "Turmeric", "Ginger", "Coriander", "Cumin (Jeera)", "Black Pepper", "Cardamom"],
  "Vegetables": ["Onion", "Tomato", "Potato", "Garlic", "Garlic (Desi)"],
  "Fruits": ["Grapes", "Mango (Alphonso)", "Coconut", "Banana", "Apple"],
};

function PriceChangeIndicator({ current, history }: { current: number; history: any[] }) {
  if (!history || history.length < 7) return <Minus className="w-4 h-4 text-muted-foreground" />;
  const weekAgo = history[Math.max(0, history.length - 7)]?.modalPrice;
  if (!weekAgo) return null;
  const pct = ((current - weekAgo) / weekAgo) * 100;
  if (Math.abs(pct) < 0.5) return <Minus className="w-4 h-4 text-muted-foreground" />;
  if (pct > 0) return (
    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
      <ArrowUpRight className="w-3 h-3" />+{pct.toFixed(1)}%
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
      <ArrowDownRight className="w-3 h-3" />{pct.toFixed(1)}%
    </span>
  );
}

const CHART_COLORS = ["#16a34a", "#dc2626", "#2563eb", "#d97706", "#7c3aed"];

function PriceComparisonChart({ selectedCrop, selectedState, allPrices }: {
  selectedCrop: string;
  selectedState: string;
  allPrices: any[];
}) {
  const { data: history, isLoading } = usePriceHistory(
    selectedCrop || undefined,
    selectedState !== "All States" ? selectedState : undefined,
    60
  );

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    const byDate: Record<string, any> = {};
    for (const h of history) {
      const date = h.recordDate?.split("T")[0] || h.recordDate;
      if (!byDate[date]) byDate[date] = { date };
      byDate[date][`${h.market}`] = h.modalPrice;
    }
    return Object.values(byDate).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [history]);

  const markets = useMemo(() => {
    if (!history) return [];
    const unique = new Set(history.map(h => h.market));
    return Array.from(unique).slice(0, 5);
  }, [history]);

  if (!selectedCrop) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <BarChart3 className="w-12 h-12 opacity-40" />
        <p className="text-sm">Select a crop from the table to view the 2-month price trend</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        No historical data available for this crop yet.
      </div>
    );
  }

  const allValues = chartData.flatMap(d => markets.map(m => d[m]).filter(Boolean));
  const minVal = Math.min(...allValues) * 0.95;
  const maxVal = Math.max(...allValues) * 1.05;

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-foreground">{selectedCrop} – 60-Day Price Trend</h3>
        <Badge variant="secondary" className="text-xs">₹ per quintal</Badge>
        {selectedState && selectedState !== "All States" && (
          <Badge variant="outline" className="text-xs">{selectedState}</Badge>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            {markets.map((market, i) => (
              <linearGradient key={market} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.2} />
                <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => {
              try { return format(parseISO(v), "dd MMM"); } catch { return v; }
            }}
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            domain={[minVal, maxVal]}
            tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: any, name: string) => [`₹${value?.toLocaleString("en-IN")}`, name]}
            labelFormatter={(label) => {
              try { return format(parseISO(label), "dd MMM yyyy"); } catch { return label; }
            }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {markets.map((market, i) => (
            <Area
              key={market}
              type="monotone"
              dataKey={market}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              fill={`url(#grad-${i})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats summary */}
      {chartData.length > 0 && markets[0] && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {(() => {
            const vals = chartData.map(d => d[markets[0]]).filter(Boolean);
            const min = Math.min(...vals);
            const max = Math.max(...vals);
            const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
            return (
              <>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-muted-foreground">60-Day Low</p>
                  <p className="font-bold text-red-600">₹{min?.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Average</p>
                  <p className="font-bold text-foreground">₹{avg?.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-muted-foreground">60-Day High</p>
                  <p className="font-bold text-green-600">₹{max?.toLocaleString("en-IN")}</p>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function MarketPrices() {
  const { data: prices, isLoading } = useMarketPrices();
  const { mutate: refresh, isPending: refreshing } = useRefreshPrices();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedCropForChart, setSelectedCropForChart] = useState("");

  const states = useMemo(() => {
    if (!prices) return [];
    return ["All States", ...Array.from(new Set(prices.map((p: any) => p.state))).sort()];
  }, [prices]);

  const filtered = useMemo(() => {
    if (!prices) return [];
    return prices.filter((p: any) => {
      const matchSearch = !search ||
        p.crop.toLowerCase().includes(search.toLowerCase()) ||
        p.market.toLowerCase().includes(search.toLowerCase()) ||
        p.state.toLowerCase().includes(search.toLowerCase());
      const matchState = selectedState === "All States" || p.state === selectedState;
      const matchCat = selectedCategory === "All" ||
        CROP_CATEGORIES[selectedCategory]?.some(c => p.crop.includes(c) || c.includes(p.crop));
      return matchSearch && matchState && matchCat;
    });
  }, [prices, search, selectedState, selectedCategory]);

  const handleRefresh = () => {
    refresh(undefined, {
      onSuccess: (data: any) => {
        toast({ title: "Prices Refreshed", description: data.message || `Loaded ${data.count} live prices.` });
      },
      onError: (err: any) => {
        toast({ title: "Using Cached Prices", description: "Live API unavailable. Displaying latest stored prices.", variant: "default" });
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mandi Market Prices</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            Live Agmarknet data · ₹ per quintal
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="gap-2 shrink-0"
          data-testid="button-refresh-prices"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Fetching Live Data..." : "Refresh from Agmarknet"}
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex-wrap h-auto gap-1 bg-muted/30 p-1">
          {Object.keys(CROP_CATEGORIES).map(cat => (
            <TabsTrigger key={cat} value={cat} className="text-xs rounded-md" data-testid={`tab-category-${cat}`}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Price Table */}
        <div className="xl:col-span-3">
          <Card className="shadow-lg shadow-black/5">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search crop, state, market..."
                    className="pl-9 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-testid="input-search-prices"
                  />
                </div>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-full sm:w-44 bg-white" data-testid="select-state-filter">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Click any row to view 60-day price trend
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground">No prices found. Try adjusting filters.</div>
              ) : (
                <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-muted/10 sticky top-0 z-10">
                      <TableRow>
                        <TableHead>Crop</TableHead>
                        <TableHead>Market · State</TableHead>
                        <TableHead className="text-right">Min</TableHead>
                        <TableHead className="text-right">Max</TableHead>
                        <TableHead className="text-right">Modal (₹/Q)</TableHead>
                        <TableHead className="text-right">Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((price: any) => (
                        <TableRow
                          key={price.id}
                          className={`cursor-pointer transition-colors ${selectedCropForChart === price.crop ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-muted/20"}`}
                          onClick={() => {
                            setSelectedCropForChart(price.crop);
                            setSelectedCrop(price.crop);
                          }}
                          data-testid={`row-market-price-${price.id}`}
                        >
                          <TableCell>
                            <p className="font-semibold text-foreground">{price.crop}</p>
                            {price.variety && price.variety !== "General" && (
                              <p className="text-xs text-muted-foreground">{price.variety}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">{price.market}</p>
                            <p className="text-xs text-muted-foreground">{price.state}</p>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {price.minPrice ? `₹${price.minPrice.toLocaleString("en-IN")}` : "—"}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {price.maxPrice ? `₹${price.maxPrice.toLocaleString("en-IN")}` : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold text-primary text-base">
                              ₹{price.pricePerQuintal?.toLocaleString("en-IN")}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={`text-xs ${price.pricePerQuintal > (price.minPrice + price.maxPrice) / 2
                                ? "border-green-300 text-green-700 bg-green-50"
                                : "border-red-200 text-red-600 bg-red-50"}`}
                            >
                              {price.pricePerQuintal > (price.minPrice + price.maxPrice) / 2
                                ? <TrendingUp className="w-3 h-3 inline mr-1" />
                                : <TrendingDown className="w-3 h-3 inline mr-1" />}
                              {price.source === "agmarknet_live" ? "Live" : "Mandi"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="border-t px-4 py-2 bg-muted/5 text-xs text-muted-foreground">
                {filtered.length} records · Source: Agmarknet (data.gov.in) · Prices in ₹/quintal
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price History Chart */}
        <div className="xl:col-span-2">
          <Card className="shadow-lg shadow-black/5 h-full">
            <CardHeader className="border-b bg-muted/20 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4 text-primary" />
                60-Day Price Comparison
              </CardTitle>
              <CardDescription>
                {selectedCropForChart
                  ? `Showing trend for ${selectedCropForChart}`
                  : "Click any row to view trend"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <PriceComparisonChart
                selectedCrop={selectedCropForChart}
                selectedState={selectedState}
                allPrices={prices || []}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Stats */}
      {prices && prices.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Crops Tracked", value: new Set(prices.map((p: any) => p.crop)).size, color: "text-primary" },
            { label: "States Covered", value: new Set(prices.map((p: any) => p.state)).size, color: "text-blue-600" },
            { label: "Markets Listed", value: new Set(prices.map((p: any) => p.market)).size, color: "text-orange-600" },
            { label: "Price Records", value: prices.length, color: "text-purple-600" },
          ].map(stat => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-5 pb-4">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground pb-2">
        Data sourced from Agmarknet (AGMARK) via data.gov.in · Government of India · Updated daily
      </p>
    </div>
  );
}
