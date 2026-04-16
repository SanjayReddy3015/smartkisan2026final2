import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";

// Page Imports
import Home from "@/pages/Home";
import MarketPrices from "@/pages/MarketPrices";
import Calculators from "@/pages/Calculators";
import Profiles from "@/pages/Profiles";
import Calendar from "@/pages/Calendar";
import Admin from "@/pages/Admin";
import Transport from "@/pages/Transport";
import MandiLocator from "@/pages/MandiLocator";
import WeatherAlerts from "@/pages/WeatherAlerts";
import TechniquesGuide from "@/pages/TechniquesGuide";
import AgriShop from "@/pages/AgriShop";
import Godowns from "@/pages/Godowns";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/market" component={MarketPrices} />
        <Route path="/calculators" component={Calculators} />
        <Route path="/profiles" component={Profiles} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/transport" component={Transport} />
        <Route path="/mandi" component={MandiLocator} />
        <Route path="/weather" component={WeatherAlerts} />
        <Route path="/admin" component={Admin} />
        <Route path="/guide" component={TechniquesGuide} />
        <Route path="/shop" component={AgriShop} />
        <Route path="/godowns" component={Godowns} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
