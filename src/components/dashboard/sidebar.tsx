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
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

const mainNav = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Event Types", icon: Calendar, href: "/dashboard/event-types" },
  { title: "Bookings", icon: Users, href: "/dashboard/bookings" },
  { title: "Workflows", icon: Zap, href: "/dashboard/workflows" },
  { title: "Routing Forms", icon: GitMerge, href: "/dashboard/routing" },
  { title: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { title: "Availability", icon: Clock, href: "/dashboard/availability" },
  { title: "Integrations", icon: Video, href: "/dashboard/integrations" },
];

const secondaryNav = [
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function AppSidebar({ user }: { user: { name?: string | null, image?: string | null, email?: string | null } }) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">M</div>
          <span className="font-semibold text-lg">MeetMe</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[100px]">{user.name || "User"}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={() => signOut()} 
            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
