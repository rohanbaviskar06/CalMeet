import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scheduling for Individuals",
  description: "Personal scheduling links, automated Google Calendar sync, and paid booking checkouts for solo pros.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
