import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources & Scheduling Tools",
  description: "Explore integrations, developer documentation, embed widgets, workflows, and scheduling guides.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
