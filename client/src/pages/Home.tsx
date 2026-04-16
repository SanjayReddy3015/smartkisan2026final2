import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Sprout, LineChart, Tractor, Truck, MapPin, CloudRain, PlayCircle, Newspaper, Play } from "lucide-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

function NewsSection() {
  const [activeTab, setActiveTab] = useState("top");
  const [location, setLocation] = useState("India");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
          const data = await res.json();
          if (data.principalSubdivision) {
            setLocation(data.principalSubdivision); // State name
          }
        } catch (e) { }
      });
    }
  }, []);

  const { data: news } = useQuery({
    queryKey: ["/api/news", activeTab, location],
    queryFn: async () => {
      const res = await fetch(`/api/news?category=${activeTab}&location=${location}`);
      return res.json();
    }
  });

  const [activeNews, setActiveNews] = useState<any>(null);

  if (!news) return <div className="animate-pulse h-[300px] bg-slate-100 rounded-lg w-full mb-8" />;

  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      {/* Top Header Marquee */}
      <div className="bg-green-700 overflow-hidden relative w-full h-[40px] flex items-center shadow-md border-b-4 border-green-800">
        <div className="bg-green-800 text-white font-bold h-full px-5 flex items-center shrink-0 z-10 gap-2 shadow-lg relative border-r border-green-600">
          <Newspaper className="h-4 w-4" /> LIVE NEWS
        </div>
        {/* @ts-ignore */}
        <marquee className="flex-1 text-white mx-4 font-medium" scrollamount="5">
          {news.map((item: any, i: number) => (
            <span key={i} className="inline-flex items-center mx-8">
              • {item.title}
            </span>
          ))}
          {/* @ts-ignore */}
        </marquee>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-between items-end mb-2">
        <Tabs defaultValue="top" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-100 grid grid-cols-3 max-w-md">
            <TabsTrigger value="top">Top News</TabsTrigger>
            <TabsTrigger value="regional">Regional ({location})</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {news.map((item: any, i: number) => (
          <Card
            key={i}
            className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all border-slate-200"
            onClick={() => setActiveNews(item)}
          >
            <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2 bg-white/95 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                {item.category || "News"}
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1 group-hover:text-green-700 transition-colors">{item.title}</h3>
              <p className="text-muted-foreground text-xs line-clamp-2">{item.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Modal */}
      <Dialog open={!!activeNews} onOpenChange={(open) => !open && setActiveNews(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white">
          <div className="relative w-full pb-[56.25%] bg-slate-100">
            <img src={activeNews?.imageUrl} className="absolute top-0 left-0 w-full h-full object-cover" />
          </div>
          <div className="p-6 pt-5">
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full mb-3">
              {activeNews?.category || "News"} • {activeNews?.source}
            </div>
            <DialogTitle className="text-xl font-bold mb-3 leading-tight">{activeNews?.title}</DialogTitle>
            <p className="text-slate-600 leading-relaxed text-sm">{activeNews?.summary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <NewsSection />
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden border-0 shadow-xl shadow-primary/5 bg-primary relative min-h-[300px] flex items-end">
          <div className="absolute inset-0 z-0">
            {/* landing page hero scenic mountain landscape */}
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
              alt="Farming landscape"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
          </div>
          <CardContent className="relative z-10 p-8 text-white w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Empowering Indian Farmers</h1>
            <p className="text-primary-foreground/90 max-w-xl text-lg mb-6 leading-relaxed">
              Access real-time market prices, AI-driven crop recommendations, and smart irrigation tracking.
            </p>
            <div className="flex gap-4">
              <Button size="lg" variant="secondary" asChild className="hover-elevate font-semibold text-primary">
                <Link href="/calculators">Start AI Calculator</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <WeatherWidget />
          <Link href="/guide" className="flex-1 flex flex-col">
            <Card className="flex-1 overflow-hidden group cursor-pointer border-0 shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1 duration-300">
              <div className="relative h-full min-h-[160px] bg-black">
                <video
                  src="/preview.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-700 opacity-50"
                  title="Background Farming Video"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500 flex flex-col items-center justify-center p-4 text-center">
                  <PlayCircle className="w-10 h-10 text-white/80 group-hover:text-white transition-all duration-300 group-hover:scale-110 mb-2 drop-shadow-md" />
                  <h3 className="text-white font-bold text-xl md:text-2xl font-serif drop-shadow-lg tracking-wide">Modern Techniques Guide</h3>
                  <p className="text-white/80 text-sm mt-1 font-medium scale-0 group-hover:scale-100 transition-transform duration-300 origin-top">Watch training videos</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" /> Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <Link href="/market">
            <Card className="group cursor-pointer hover:border-primary/50 hover-elevate transition-all h-full">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Market Prices</h3>
                  <p className="text-sm text-muted-foreground mt-1">Live Mandi prices for all crops across states.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calculators">
            <Card className="group cursor-pointer hover:border-primary/50 hover-elevate transition-all h-full">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <Tractor className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Yield Estimator</h3>
                  <p className="text-sm text-muted-foreground mt-1">Calculate expected profits based on acres and crop type.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profiles">
            <Card className="group cursor-pointer hover:border-primary/50 hover-elevate transition-all h-full">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Farm Profiles</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage farm details and track soil history.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/transport">
            <Card className="group cursor-pointer hover:border-primary/50 hover-elevate transition-all h-full">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Transport Finder</h3>
                  <p className="text-sm text-muted-foreground mt-1">Find nearby trucks and estimate transport cost to mandi.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/mandi">
            <Card className="group cursor-pointer hover:border-primary/50 hover-elevate transition-all h-full">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Mandi Locator</h3>
                  <p className="text-sm text-muted-foreground mt-1">GPS map to find nearby APMC mandis with navigation.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/weather">
            <Card className="group cursor-pointer hover:border-primary/50 hover-elevate transition-all h-full">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Weather Alerts</h3>
                  <p className="text-sm text-muted-foreground mt-1">Rain, frost, pest and heatwave alerts for your crops.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  );
}
