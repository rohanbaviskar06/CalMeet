"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Bell, 
  Calendar, 
  CalendarX, 
  BellRing,
  Info,
  Video,
  X
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  getNotifications, 
  markNotificationsAsRead, 
  deleteNotification, 
  clearAllNotifications 
} from "@/app/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  read: boolean;
  createdAt: Date | string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  
  // Track notifications that we have already seen to prevent duplicate push notifications
  const seenNotificationIds = useRef<Set<string>>(new Set());
  const initialFetchDone = useRef(false);

  // Sync permission status
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Fetch notifications helper
  const fetchNotifications = async (isPoll = false) => {
    try {
      const data = await getNotifications();
      // Format response to ensure Date objects are handled
      const formattedData: NotificationItem[] = data.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));

      // Calculate unread count
      const unreads = formattedData.filter(n => !n.read).length;
      setUnreadCount(unreads);

      // Push notification trigger
      if (isPoll && initialFetchDone.current && Notification.permission === "granted") {
        formattedData.forEach(n => {
          if (!n.read && !seenNotificationIds.current.has(n.id)) {
            new Notification(n.title, {
              body: n.message,
              icon: "/favicon.ico",
            });
            seenNotificationIds.current.add(n.id);
          }
        });
      }

      // Add to seen list initially
      if (!initialFetchDone.current) {
        formattedData.forEach(n => seenNotificationIds.current.add(n.id));
        initialFetchDone.current = true;
      }

      setNotifications(formattedData);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Initial fetch and poll
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle dropdown open
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      // Set to read locally immediately for responsiveness
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      try {
        await markNotificationsAsRead();
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  const handleClearSingle = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
      fetchNotifications();
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      await clearAllNotifications();
      toast.success("All notifications cleared");
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
      fetchNotifications();
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Browser does not support desktop notifications.");
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === "granted") {
        toast.success("Desktop notifications enabled successfully!");
        new Notification("CalMeet Notifications Enabled", {
          body: "You'll now receive alerts for schedules and cancellations.",
        });
      } else {
        toast.warning("Notification permission denied.");
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-full transition-all hover:bg-muted duration-200"
          >
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5 text-primary" />
            ) : (
              <Bell className="h-5 w-5 text-muted-foreground" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent className="w-80 sm:w-96 p-0 border border-zinc-150/60 dark:border-zinc-850 bg-background/95 backdrop-blur-md shadow-2xl rounded-2xl" align="end">
        <div className="p-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-base">Notifications</span>
            <p className="text-xs text-muted-foreground font-normal">
              {unreadCount > 0 ? `You have ${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="xs"
                className="text-xs text-muted-foreground hover:text-destructive h-7 px-2 hover:bg-muted/50 rounded-lg transition-colors"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            )}
            {permission !== "granted" && (
              <Button
                variant="outline"
                size="xs"
                className="text-[10px] h-7 px-2.5 rounded-lg border-primary/20 text-primary hover:bg-primary/5 transition-all"
                onClick={requestNotificationPermission}
              >
                Enable Alerts
              </Button>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-[350px] overflow-y-auto overflow-x-hidden divide-y divide-zinc-100 dark:divide-zinc-900">
          {notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium text-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                We'll notify you here when meetings are scheduled or cancelled.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications.map((n) => {
                const isBookingCreated = n.type === "BOOKING_CREATED";
                const isBookingCancelled = n.type === "BOOKING_CANCELLED";

                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                    className="relative overflow-hidden"
                  >
                    <motion.div
                      drag="x"
                      dragDirectionLock
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={{ left: 0.6, right: 0.6 }}
                      onDragEnd={(e, info) => {
                        if (Math.abs(info.offset.x) > 100) {
                          handleClearSingle(n.id);
                        }
                      }}
                      className="p-4 flex items-start gap-3 transition-colors duration-200 hover:bg-muted/30 bg-background relative select-none touch-pan-y active:cursor-grabbing outline-none focus:outline-none"
                    >
                      {!n.read && (
                        <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-primary" />
                      )}
                      
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                        isBookingCreated && "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
                        isBookingCancelled && "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400",
                        !isBookingCreated && !isBookingCancelled && "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                      )}>
                        {isBookingCreated && <Calendar className="h-4.5 w-4.5" />}
                        {isBookingCancelled && <CalendarX className="h-4.5 w-4.5" />}
                        {!isBookingCreated && !isBookingCancelled && <Info className="h-4.5 w-4.5" />}
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                          <span className="font-semibold text-sm truncate text-foreground">{n.title}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0 select-none">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/90 leading-normal line-clamp-2">
                          {n.message}
                        </p>
                        {n.link && (
                          <div className="mt-2.5">
                            <a
                              href={n.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/95 transition-all shadow-sm"
                            >
                              <Video className="w-3.5 h-3.5" />
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearSingle(n.id);
                        }}
                        className="absolute top-3.5 right-3.5 p-1 text-muted-foreground/60 hover:text-destructive hover:bg-muted/50 rounded-full transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
