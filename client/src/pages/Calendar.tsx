import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Clock, Calendar as CalendarIcon } from "lucide-react";

export default function Calendar() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Crop Calendar</h1>
        <p className="text-muted-foreground mt-2">General timeline for Kharif and Rabi seasons</p>
      </div>

      <div className="space-y-6">
        {/* Timeline Item 1 */}
        <div className="flex gap-4 relative">
          <div className="w-px h-full bg-border absolute left-6 top-8" />
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 z-10 text-primary">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="text-accent font-semibold uppercase tracking-wider text-xs mb-1">June - July</CardDescription>
                  <CardTitle className="text-lg">Kharif Sowing</CardTitle>
                </div>
                <div className="bg-primary/5 text-primary px-3 py-1 rounded-md text-sm font-medium">Monsoon</div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-muted-foreground text-sm">
              Prepare the land and sow seeds for Rice, Maize, and Cotton. Ensure adequate drainage channels are in place before heavy rains begin.
            </CardContent>
          </Card>
        </div>

        {/* Timeline Item 2 */}
        <div className="flex gap-4 relative">
          <div className="w-px h-full bg-border absolute left-6 top-8" />
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 z-10 text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="text-orange-600 font-semibold uppercase tracking-wider text-xs mb-1">September - October</CardDescription>
                  <CardTitle className="text-lg">Kharif Harvesting</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-muted-foreground text-sm">
              Harvest the grown crops. Store safely to protect from post-monsoon showers.
            </CardContent>
          </Card>
        </div>

        {/* Timeline Item 3 */}
        <div className="flex gap-4 relative">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10 text-blue-600">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow border-blue-100 bg-blue-50/30">
            <CardHeader className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="text-blue-600 font-semibold uppercase tracking-wider text-xs mb-1">November - December</CardDescription>
                  <CardTitle className="text-lg">Rabi Sowing</CardTitle>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">Winter</div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-muted-foreground text-sm">
              Sow seeds for Wheat, Barley, and Mustard. Irrigation is critical during this period due to lack of rainfall.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
