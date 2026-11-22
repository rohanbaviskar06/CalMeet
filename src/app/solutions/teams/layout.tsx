import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scheduling for Teams",
  description: "Round-robin meeting distribution, collective availability, and shared team booking pages.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
