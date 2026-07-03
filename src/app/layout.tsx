import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CalMeet - Modern Scheduling for Teams",
  description: "CalMeet helps you connect with people when it matters. Automate your meetings, sync your calendars, and reclaim your time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <NextAuthProvider>
          {children}
          <Toaster position="top-center" richColors />
          <Analytics />
          <SpeedInsights />
        </NextAuthProvider>
      </body>
    </html>
  );
}
