import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Compliance",
  description: "Learn about CalMeet SOC 2 & HIPAA-ready cloud architecture, encryption at rest and in transit, and data privacy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
