import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Updates",
  description: "Product releases, productivity insights, and modern scheduling guides from the CalMeet team.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
