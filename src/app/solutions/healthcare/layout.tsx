import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthcare & Telehealth Scheduling",
  description: "Schedule patient consultations and telehealth video appointments with SOC 2 & HIPAA-ready security.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
