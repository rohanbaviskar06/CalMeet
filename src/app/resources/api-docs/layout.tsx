import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "REST API Documentation",
  description: "Complete API references, endpoints, and authentication for building custom scheduling workflows.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
