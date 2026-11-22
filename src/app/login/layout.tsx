import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your CalMeet account to manage your calendar and bookings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
