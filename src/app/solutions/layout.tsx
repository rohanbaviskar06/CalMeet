import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scheduling Solutions",
  description: "Discover how CalMeet streamlines meetings for solo consultants, sales teams, recruiters, and enterprises.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
