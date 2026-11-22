import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collective Events",
  description: "Host multi-attendee and collective scheduling calls where all team members are required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
