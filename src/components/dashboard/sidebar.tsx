"use client";

import { 
  Link2, 
  CalendarDays, 
  Clock, 
  Settings as SettingsIcon, 
  Users, 
  Grid2X2, 
  LayoutDashboard,
  LogOut,
  BarChart3,
  Zap,
  GitMerge,
  ExternalLink,
  Copy,
  Check,
  Search,
  ArrowLeft,
  KeyRound,
  CreditCard,
  Code2,
  Lock,
  Calendar,
  Video,
  Palette,
  CalendarOff,
  Bell,
  Gift,
  ShieldCheck,
  Webhook,
  Key,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
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
  SidebarTrigger,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { usePricingModal } from "@/components/dashboard/pricing-modal";
import { NotificationBell } from "./notification-bell";

const mainNav = [
  { title: "Event Types", icon: Link2, href: "/dashboard/event-types", badge: null },
  { title: "Bookings", icon: CalendarDays, href: "/dashboard/bookings", badge: null },
  { title: "Availability", icon: Clock, href: "/dashboard/availability", badge: null },
  { title: "Teams", icon: Users, href: "/dashboard/team", badge: null },
  { title: "Apps", icon: Grid2X2, href: "/dashboard/integrations", badge: null },
  { title: "Routing Forms", icon: GitMerge, href: "/dashboard/routing", badge: "Pro" },
  { title: "Workflows", icon: Zap, href: "/dashboard/workflows", badge: "Pro" },
  { title: "Analytics", icon: BarChart3, href: "/dashboard/analytics", badge: null },
];

export function AppSidebar({ 
  user,
  plan = "FREE"
}: { 
  user: { name?: string | null, image?: string | null, email?: string | null, username?: string | null };
  plan?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openPricingModal } = usePricingModal();
  const [copied, setCopied] = useState(false);

  const username = user.username || user.email?.split("@")[0] || "user";
  const relativePublicUrl = `/${username}`;
  const isSettingsPage = pathname.startsWith("/dashboard/settings");
  const activeTab = searchParams.get("tab") || "overview";

  const copyPublicLink = () => {
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}/${username}` : `/${username}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Public booking link copied!");
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-zinc-200 dark:border-zinc-800 bg-background">
      {/* Dynamic Header: Normal Brand OR Settings Back Button */}
      {isSettingsPage ? (
        <SidebarHeader className="p-3.5 border-b border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </SidebarHeader>
      ) : (
        <SidebarHeader className="p-3.5 border-b border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                  CalMeet
                </span>
                <span className="text-[10px] text-zinc-400 font-medium -mt-0.5">
                  {plan === "PRO" ? "Pro Workspace" : "Personal Workspace"}
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-1.5">
              <NotificationBell />
            </div>
          </div>
        </SidebarHeader>
      )}
      
      <SidebarContent className="px-2 py-2">
        {/* If on SETTINGS: Render Cal.com Single Settings Sidebar */}
        {isSettingsPage ? (
          <div className="space-y-4">
            {/* Overview item */}
            <div className="px-1">
              <Link
                href="/dashboard/settings"
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left",
                  activeTab === "overview"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
                  <div className="bg-current rounded-[2px]" />
                  <div className="bg-current rounded-[2px]" />
                  <div className="bg-current rounded-[2px]" />
                  <div className="bg-current rounded-[2px]" />
                </div>
                <span>Overview</span>
              </Link>
            </div>

            {/* Personal Group */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                <Avatar className="h-4 w-4 rounded-md">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="text-[8px]">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{user.name || "Personal"}</span>
              </div>

              <div className="space-y-0.5 pl-2">
                {[
                  { id: "profile", label: "Profile" },
                  { id: "general", label: "General" },
                  { id: "calendars", label: "Calendars" },
                  { id: "conferencing", label: "Conferencing" },
                  { id: "appearance", label: "Appearance" },
                  { id: "out-of-office", label: "Out of office" },
                  { id: "notifications", label: "Push notifications" },
                  { id: "refer-and-earn", label: "Refer and earn" },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/settings?tab=${item.id}`}
                    className={cn(
                      "block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                      activeTab === item.id
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Security Group */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
                <span>Security</span>
              </div>
              <div className="space-y-0.5 pl-2">
                {[
                  { id: "password", label: "Password" },
                  { id: "2fa", label: "Two factor auth" },
                  { id: "compliance", label: "Compliance" },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/settings?tab=${item.id}`}
                    className={cn(
                      "block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                      activeTab === item.id
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Billing Group */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                <span>Billing</span>
              </div>
              <div className="space-y-0.5 pl-2">
                <Link
                  href="/dashboard/settings?tab=billing"
                  className={cn(
                    "block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                    activeTab === "billing"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                >
                  Manage billing
                </Link>
                <button
                  onClick={openPricingModal}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Plans
                </button>
              </div>
            </div>

            {/* Developer Group */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                <Code2 className="h-3.5 w-3.5 text-zinc-400" />
                <span>Developer</span>
              </div>
              <div className="space-y-0.5 pl-2">
                {[
                  { id: "webhooks", label: "Webhooks" },
                  { id: "api-keys", label: "API keys" },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/settings?tab=${item.id}`}
                    className={cn(
                      "block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                      activeTab === item.id
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Normal Dashboard Navigation */
          <>
            {/* Search quick button */}
            <div className="px-2 py-1.5 group-data-[state=collapsed]:hidden">
              <button 
                onClick={() => {
                  const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
                  if (searchInput) searchInput.focus();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200/60 dark:border-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5" />
                  <span>Search...</span>
                </div>
                <kbd className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 font-mono">⌘K</kbd>
              </button>
            </div>

            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {mainNav.map((item) => {
                    const isGated = item.badge === "Pro" && plan !== "PRO";
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    const buttonContent = (
                      <>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-xs">{item.title}</span>
                        {item.badge && (
                          <span className={cn(
                            "ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                            plan === "PRO" 
                              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    );

                    return (
                      <SidebarMenuItem key={item.title}>
                        {isGated ? (
                          <SidebarMenuButton 
                            onClick={(e) => {
                              e.preventDefault();
                              openPricingModal();
                            }}
                            isActive={isActive}
                            tooltip={item.title}
                            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 h-9 rounded-lg"
                          >
                            {buttonContent}
                          </SidebarMenuButton>
                        ) : (
                          <SidebarMenuButton 
                            render={<Link href={item.href} prefetch={true} />}
                            isActive={isActive}
                            tooltip={item.title}
                            className={cn(
                              "h-9 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors",
                              isActive && "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-semibold"
                            )}
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

            <SidebarSeparator className="my-2 bg-zinc-200/60 dark:bg-zinc-800/60" />

            {/* Public Page Quick Links */}
            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-2">
                Public Page
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      render={
                        <a 
                          href={relativePublicUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                        />
                      }

                      tooltip="View public page"
                      className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      <span>View public page</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={copyPublicLink}
                      tooltip="Copy public page link"
                      className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span>Copy public link</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      render={<Link href="/dashboard/settings" />}
                      isActive={pathname.startsWith("/dashboard/settings")}
                      tooltip="Settings"
                      className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg"
                    >
                      <SettingsIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer Profile & Logout */}
      <SidebarFooter className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center justify-between gap-3 group-data-[state=collapsed]:justify-center">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 shrink-0">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="rounded-lg text-xs font-semibold bg-zinc-200 dark:bg-zinc-800">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 group-data-[state=collapsed]:hidden">
              <span className="text-xs font-medium truncate text-zinc-900 dark:text-zinc-100">
                {user.name || "User"}
              </span>
              <span className="text-[11px] text-zinc-400 truncate">
                /{username}
              </span>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })} 
            title="Sign out"
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-red-500 transition-colors group-data-[state=collapsed]:hidden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
