import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how CalMeet protects your calendar data, personal information, and respect for privacy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
