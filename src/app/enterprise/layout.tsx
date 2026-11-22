import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise Scheduling",
  description: "Custom security, SOC 2 & HIPAA-ready architecture, dedicated CSM, and 99.9% uptime SLA for large organizations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
