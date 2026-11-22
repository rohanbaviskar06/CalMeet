import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Out of Office & Vacations",
  description: "Schedule vacations and automatically block calendar availability during time off.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
