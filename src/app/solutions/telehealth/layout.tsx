import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telehealth Appointments",
  description: "Secure, browser-based telehealth video visits with automated patient reminders and calendar sync.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
