import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automated Workflows",
  description: "Trigger email reminders, follow-up messages, and webhooks automatically on booking events.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
