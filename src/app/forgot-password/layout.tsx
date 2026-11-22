import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your CalMeet account password securely via email.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
