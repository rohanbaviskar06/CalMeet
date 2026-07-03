"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock,
  MoreHorizontal,
  Zap,
  GitMerge,
  BarChart3,
  Video,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

import { usePricingModal } from "@/components/dashboard/pricing-modal";

const mainNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Events", icon: Calendar, href: "/dashboard/event-types" },
  { title: "Bookings", icon: Users, href: "/dashboard/bookings" },
  { title: "Availability", icon: Clock, href: "/dashboard/availability" },
];

const moreNavItems = [
  { title: "Workflows", icon: Zap, href: "/dashboard/workflows" },
  { title: "Routing Forms", icon: GitMerge, href: "/dashboard/routing" },
  { title: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { title: "Integrations", icon: Video, href: "/dashboard/integrations" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const gatedItems = ["Workflows", "Routing Forms"];

export function MobileNav({ plan = "FREE" }: { plan?: string }) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { openPricingModal } = usePricingModal();

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-t border-zinc-150/60 dark:border-zinc-850 px-4 pb-safe-offset-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <nav className="flex items-center justify-around h-16 max-w-md mx-auto">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center w-14 h-14 transition-colors duration-200 rounded-2xl",
                  isActive 
                    ? "text-primary" 
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                <div className="relative flex items-center justify-center p-1.5 rounded-lg transition-transform active:scale-95">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-medium tracking-wide mt-1 uppercase text-center block">
                  {item.title}
                </span>
              </Link>
            );
          })}
          
          {/* More button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={cn(
              "relative flex flex-col items-center justify-center w-14 h-14 transition-colors duration-200 rounded-2xl active:scale-95",
              isMoreOpen 
                ? "text-primary" 
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            <div className="relative flex items-center justify-center p-1.5 rounded-lg">
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-medium tracking-wide mt-1 uppercase text-center block">
              More
            </span>
          </button>
        </nav>
      </div>

      {/* More Slide-up Drawer */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            {/* Drawer container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-zinc-150/60 dark:border-zinc-850 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-h-[85vh] overflow-y-auto pb-10"
            >
              {/* Drag Handle Decoration */}
              <div className="w-12 h-1 bg-zinc-250 dark:bg-zinc-800 rounded-full mx-auto my-4" />
              
              <div className="px-6 flex items-center justify-between mb-6">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">More Features</h3>
                  <p className="text-xs text-muted-foreground font-normal">Explore additional capabilities and settings</p>
                </div>
                <button 
                  onClick={() => setIsMoreOpen(false)}
                  className="p-2 hover:bg-muted dark:hover:bg-zinc-900 rounded-full transition-colors"
                >
                  <X className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 px-6">
                {moreNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const isGated = gatedItems.includes(item.title);
                  const isLocked = isGated && plan !== "PRO";

                  return (
                    <Link
                      key={item.href}
                      href={isLocked ? "#" : item.href}
                      onClick={(e) => {
                        setIsMoreOpen(false);
                        if (isLocked) {
                          e.preventDefault();
                          openPricingModal();
                        }
                      }}
                      className={cn(
                        "flex flex-col items-start gap-2.5 p-4 rounded-2xl border transition-all duration-300 active:scale-98 relative overflow-hidden",
                        isActive
                          ? "bg-primary/5 border-primary/20 text-primary"
                          : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-150/60 dark:border-zinc-850 hover:bg-muted text-zinc-800 dark:text-zinc-200"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl",
                        isActive ? "bg-primary/10" : "bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800 shadow-sm"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold tracking-tight">{item.title}</span>
                        {isLocked && (
                          <span className="text-[8px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 shrink-0">
                            Pro
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
                
                {/* Sign Out inside More */}
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-destructive/10 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all duration-300 text-left col-span-2 mt-2 active:scale-98"
                >
                  <div className="p-2 rounded-xl bg-destructive/10">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
