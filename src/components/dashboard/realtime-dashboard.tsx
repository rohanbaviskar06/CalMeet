"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function RealtimeDashboardListener() {
  const router = useRouter();

  useEffect(() => {
    // Request desktop notification permission on mount
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch((err) =>
          console.error("Error requesting notification permission:", err)
        );
      }
    }

    console.log("Subscribing to real-time Booking table changes...");
    const channel = supabase
      .channel("realtime-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Booking" },
        (payload) => {
          console.log("Real-time booking change detected:", payload);

          // Trigger a desktop notification on new booking insertion
          if (payload.eventType === "INSERT") {
            const newBooking = payload.new as any;
            if (
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              try {
                new Notification("📅 New Meeting Booked!", {
                  body: `${newBooking.guestName || "A guest"} has scheduled a new meeting.`,
                  tag: newBooking.id,
                });
              } catch (e) {
                console.error("Failed to show desktop notification:", e);
              }
            }
          }

          // Trigger a server component re-fetch/refresh
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "EventType" },
        () => {
          console.log("EventType view/update detected, refreshing...");
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "RoutingForm" },
        () => {
          console.log("RoutingForm view/update detected, refreshing...");
          router.refresh();
        }
      )
      .subscribe((status) => {
        console.log("Real-time database subscription status:", status);
      });

    return () => {
      console.log("Unsubscribing from real-time database changes...");
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
