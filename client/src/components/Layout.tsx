import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Chatbot } from "./Chatbot";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden relative">
          <header className="flex items-center justify-between h-16 px-4 bg-white/50 backdrop-blur-md border-b sticky top-0 z-40">
            <SidebarTrigger className="hover-elevate" />
            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-primary">
              <Link href="/admin">
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Portal</span>
              </Link>
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          <Chatbot />
        </div>
      </div>
    </SidebarProvider>
  );
}
