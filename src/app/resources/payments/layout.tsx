import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paid Bookings & Payments",
  description: "Collect upfront consultation fees securely via Razorpay with automated invoicing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
