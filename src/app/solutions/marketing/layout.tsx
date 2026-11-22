import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing & Conversion Scheduling",
  description: "Convert marketing campaigns, webinars, and website visitors into confirmed demo appointments.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
