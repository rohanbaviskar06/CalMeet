import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instant Meetings",
  description: "Jump into immediate video calls with prospects and clients with zero scheduling latency.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
