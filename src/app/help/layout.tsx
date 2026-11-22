import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Knowledge Base",
  description: "Guides, tutorials, and frequently asked questions for setting up and mastering CalMeet scheduling.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
