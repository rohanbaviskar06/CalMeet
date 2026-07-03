"use client";

import { 
  Calendar, 
  Clock, 
  Home, 
  Settings, 
  Users, 
  Video,
  LayoutDashboard,
  LogOut,
  BarChart3,
  Contact,
  Zap,
  GitMerge
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

import { usePricingModal } from "@/components/dashboard/pricing-modal";
import { NotificationBell } from "./notification-bell";

const mainNav = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Event Types", icon: Calendar, href: "/dashboard/event-types" },
  { title: "Bookings", icon: Contact, href: "/dashboard/bookings" },
  { title: "Team", icon: Users, href: "/dashboard/team" },
  { title: "Workflows", icon: Zap, href: "/dashboard/workflows" },
  { title: "Routing Forms", icon: GitMerge, href: "/dashboard/routing" },
  { title: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { title: "Availability", icon: Clock, href: "/dashboard/availability" },
  { title: "Integrations", icon: Video, href: "/dashboard/integrations" },
];

const secondaryNav = [
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const gatedItems = ["Workflows", "Routing Forms"];

export function AppSidebar({ 
  user,
  plan = "FREE"
}: { 
  user: { name?: string | null, image?: string | null, email?: string | null };
  plan?: string;
}) {
  const pathname = usePathname();
  const { openPricingModal } = usePricingModal();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between gap-3 group-data-[state=collapsed]:justify-center">
          <div className="flex items-center gap-3 group-data-[state=collapsed]:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">M</div>
            <span className="font-semibold text-lg">CalMeet</span>
          </div>
          <div className="flex items-center gap-2 group-data-[state=collapsed]:flex-col">
            <div className="hidden md:block">
              <NotificationBell />
            </div>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const isGated = gatedItems.includes(item.title);
                const isLocked = isGated && plan !== "PRO";

                const buttonContent = (
                  <>
                    <item.icon />
                    <span>{item.title}</span>
                    {isLocked && (
                      <span className="ml-auto text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                        Pro
                      </span>
                    )}
                  </>
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    {isLocked ? (
                      <SidebarMenuButton 
                        onClick={(e) => {
                          e.preventDefault();
                          openPricingModal();
                        }}
                        isActive={pathname === item.href}
                        tooltip={item.title}
                      >
                        {buttonContent}
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton 
                        render={<Link href={item.href} />}
                        isActive={pathname === item.href}
                        tooltip={item.title}
                      >
                        {buttonContent}
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between gap-4 group-data-[state=collapsed]:justify-center">
          <div className="flex items-center gap-3">
            <div className={cn(
              "relative rounded-full p-[1.5px] shrink-0",
              plan === "PRO" && "bg-gradient-to-tr from-amber-500 via-primary to-orange-500 ring-1 ring-primary/20"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {plan === "PRO" && (
                <span className="absolute -bottom-1 -right-1 flex h-3.5 items-center justify-center rounded-full bg-primary px-1 text-[6px] font-black uppercase text-primary-foreground shadow-md border border-white dark:border-zinc-950 select-none">
                  Pro
                </span>
              )}
            </div>
            <div className="flex flex-col group-data-[state=collapsed]:hidden">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium truncate max-w-[70px]">{user.name || "User"}</span>
                {plan === "PRO" && (
                  <span className="text-[7px] bg-primary/10 text-primary font-extrabold px-1 py-0.5 rounded uppercase tracking-wider select-none shrink-0">
                    Pro
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={() => signOut()} 
            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors group-data-[state=collapsed]:hidden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
