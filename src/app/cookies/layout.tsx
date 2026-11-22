import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How CalMeet uses essential and functional cookies to ensure secure and seamless scheduling sessions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
