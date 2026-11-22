import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizations & Multi-Team Scheduling",
  description: "Enterprise scheduling with centralized management, custom subdomains, SAML SSO, and audit logging.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
