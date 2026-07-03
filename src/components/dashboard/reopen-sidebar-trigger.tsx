"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReopenSidebarTrigger() {
  const { open, toggleSidebar, isMobile } = useSidebar();

  if (open) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        "fixed top-4 left-4 z-50 rounded-xl shadow-md border bg-background/80 backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95",
        isMobile ? "flex" : "hidden md:flex"
      )}
    >
      <PanelLeft className="h-5 w-5 text-muted-foreground" />
      <span className="sr-only">Open Sidebar</span>
    </Button>
  );
}
