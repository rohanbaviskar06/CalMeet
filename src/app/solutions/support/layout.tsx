import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Support Scheduling",
  description: "Provide VIP customer support sessions, screen-shares, and onboarding calls without email ping-pong.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
