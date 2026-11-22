import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Booking",
  description: "View meeting details, reschedule, or cancel your booking securely.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
