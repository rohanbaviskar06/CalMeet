import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Scheduling & Lead Routing",
  description: "Qualify inbound leads and route high-value prospects to the right account executive instantly.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
