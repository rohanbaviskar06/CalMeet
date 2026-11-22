import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Platform & APIs",
  description: "Build custom scheduling workflows with REST APIs, signed HMAC-SHA256 webhooks, and embeddable widgets.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
