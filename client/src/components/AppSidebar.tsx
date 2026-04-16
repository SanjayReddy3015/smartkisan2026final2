import { Link, useLocation } from "wouter";
import {
  Home,
  LineChart,
  Sprout,
  Users,
  Tractor,
  Truck,
  MapPin,
  CloudRain,
  ShoppingCart,
  ThermometerSnowflake,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Market Prices", url: "/market", icon: LineChart },
  { title: "AI Calculators", url: "/calculators", icon: Sprout },
  { title: "Farmer Profiles", url: "/profiles", icon: Users },
  { title: "Crop Calendar", url: "/calendar", icon: Tractor },
  { title: "Transport Finder", url: "/transport", icon: Truck },
  { title: "Mandi Locator", url: "/mandi", icon: MapPin },
  { title: "Weather Alerts", url: "/weather", icon: CloudRain },
  { title: "Agri-Shop", url: "/shop", icon: ShoppingCart },
  { title: "AC Godowns", url: "/godowns", icon: ThermometerSnowflake },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-inner">
            <Sprout className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-sidebar-foreground">SmartKisan</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-medium"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
