import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & Help Center",
  description: "Get assistance with your CalMeet calendar sync, account security, bookings, or enterprise sales questions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
