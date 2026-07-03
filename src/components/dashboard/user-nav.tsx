"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Settings, LogOut, LayoutDashboard } from "lucide-react";

export function UserNav({ user }: { user: any }) {
  const isPro = user?.plan === "PRO";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20"
          >
            <div className={cn(
              "relative rounded-full p-[2px] transition-all",
              isPro && "bg-gradient-to-tr from-amber-500 via-primary to-orange-500 ring-2 ring-primary/20 ring-offset-1"
            )}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {isPro && (
                <span className="absolute -bottom-1.5 -right-1.5 flex h-4 items-center justify-center rounded-full bg-primary px-1 text-[7px] font-black uppercase text-primary-foreground shadow-md border border-white dark:border-zinc-950 select-none">
                  Pro
                </span>
              )}
            </div>
          </Button>
        }
      />
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                {isPro && (
                  <span className="text-[8px] bg-primary/10 text-primary font-extrabold px-1 py-0.5 rounded uppercase tracking-wider select-none">
                    Pro
                  </span>
                )}
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link href="/dashboard" className="flex w-full items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link href="/dashboard/settings" className="flex w-full items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:bg-destructive/5 focus:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
