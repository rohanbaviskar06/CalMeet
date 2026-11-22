import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation & Guides",
  description: "Step-by-step setup guides for availability, Google Meet links, embed codes, and team routing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
