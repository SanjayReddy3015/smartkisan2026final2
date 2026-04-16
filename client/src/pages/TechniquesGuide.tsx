import { BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const VIDEOS = [
    {
        id: "drip-irrigation",
        title: "Modern Drip Irrigation Setup",
        desc: "Learn how to significantly reduce water usage while maximizing yield with precision drip irrigation techniques.",
        category: "Irrigation",
        duration: "10:12",
        embedUrl: "https://www.youtube.com/embed/btrNkwn1tjk",
    },
    {
        id: "drone-spraying",
        title: "Advanced Drone Spraying",
        desc: "Discover the efficiency of agricultural drones for uniform pesticide and fertilizer application.",
        category: "Technology",
        duration: "5:26",
        embedUrl: "https://www.youtube.com/embed/bCGLt762atg",
    },
    {
        id: "hydroponics",
        title: "Commercial Hydroponics",
        desc: "A beginner's guide to soil-less farming techniques for high-value crops in controlled environments.",
        category: "Farming Systems",
        duration: "14:20",
        embedUrl: "https://www.youtube.com/embed/UMasKCR_o3Q",
    },
    {
        id: "soil-testing",
        title: "Digital Soil Testing Kits",
        desc: "How to safely test your soil NPK and pH values using modern kits directly in the field.",
        category: "Soil Health",
        duration: "4:05",
        embedUrl: "https://www.youtube.com/embed/0E71GJiPlHQ",
    },
];

export default function TechniquesGuide() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Banner */}
            <div className="relative rounded-3xl overflow-hidden min-h-[250px] flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/5">
                <div className="absolute inset-0 bg-primary/90 z-10 mix-blend-multiply" />
                <img
                    src="https://images.unsplash.com/photo-1592982537447-6f2c6e6e2f41?q=80&w=2070&auto=format&fit=crop"
                    alt="Modern Farming Technology"
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
                />
                <div className="relative z-20 text-center space-y-4 px-4 w-full max-w-3xl flex flex-col items-center">
                    <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md px-4 py-1 flex gap-2">
                        <BookOpen className="w-4 h-4" /> Educational Hub
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-lg">
                        Modern Techniques Guide
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
                        Master the future of agriculture with our curated collection of expert video tutorials.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {VIDEOS.map((video) => (
                    <Card key={video.id} className="overflow-hidden group hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-500 flex flex-col">
                        <div className="relative w-full pt-[56.25%] bg-black flex-shrink-0">
                            {/* Functional YouTube Iframe */}
                            <iframe
                                src={video.embedUrl}
                                title={video.title}
                                className="absolute top-0 left-0 w-full h-full border-0 z-20"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />

                            {/* Category Badge overlaying video corner */}
                            <div className="absolute top-4 left-4 z-30 flex gap-2 pointer-events-none">
                                <Badge className="bg-black/70 text-white backdrop-blur-md border-0">{video.category}</Badge>
                            </div>
                        </div>

                        <CardContent className="p-6 flex-grow flex flex-col bg-card/50 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold font-serif mb-2 text-foreground group-hover:text-primary transition-colors">{video.title}</h3>
                            <p className="text-muted-foreground leading-relaxed flex-grow">{video.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    );
}
