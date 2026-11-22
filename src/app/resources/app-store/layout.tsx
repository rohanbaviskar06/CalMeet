import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations & App Store",
  description: "Connect Google Calendar, Zoom, Razorpay, webhooks, and automation tools with CalMeet.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
