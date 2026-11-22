import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HR & People Ops Scheduling",
  description: "Streamline employee 1-on-1s, performance reviews, benefits consultations, and team offsites.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
