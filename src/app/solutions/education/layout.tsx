import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education & Office Hours",
  description: "Simplify student advising, office hours, and faculty appointments with friction-free booking links.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
