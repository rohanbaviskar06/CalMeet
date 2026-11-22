import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Understand the terms and conditions governing the use of CalMeet scheduling software and services.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
