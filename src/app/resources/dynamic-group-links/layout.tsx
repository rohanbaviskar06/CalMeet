import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dynamic Group Links",
  description: "Combine multiple teammate usernames into instant ad-hoc meeting links with zero setup.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
