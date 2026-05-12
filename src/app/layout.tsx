import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetMe - Modern Scheduling for Teams",
  description: "MeetMe helps you connect with people when it matters. Automate your meetings, sync your calendars, and reclaim your time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </NextAuthProvider>
      </body>
    </html>
  );
}
