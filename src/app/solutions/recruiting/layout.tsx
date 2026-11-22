import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiting & Interview Scheduling",
  description: "Accelerate your hiring pipeline with automated candidate interview scheduling and interviewer panels.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
