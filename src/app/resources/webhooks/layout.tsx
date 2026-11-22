import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Webhooks",
  description: "Listen to booking creation, rescheduling, and cancellation events with signed HMAC payloads.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
