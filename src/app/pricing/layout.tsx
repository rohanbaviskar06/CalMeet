import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description: "Flexible scheduling plans for solo professionals, fast-growing teams, and enterprises. Start free.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
