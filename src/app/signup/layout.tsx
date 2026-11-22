import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Get started free with CalMeet. Create your personal booking link in under 2 minutes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
