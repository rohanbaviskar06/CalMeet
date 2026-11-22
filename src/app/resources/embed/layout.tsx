import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed Scheduling Widget",
  description: "Add inline booking calendars, popup buttons, or email embed links to your site.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
