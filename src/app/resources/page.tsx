"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { 
  Type, 
  Code2, 
  Newspaper, 
  Smartphone, 
  Moon, 
  Zap, 
  Users, 
  CreditCard, 
  Link as LinkIcon, 
  FileText, 
  Network, 
  Webhook,
  Search,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "Font: MeetMe Sans",
    description: "Our own variable typeface for user interface design",
    icon: <Type className="h-6 w-6" />,
    href: "#"
  },
  {
    title: "Embed",
    description: "Embed MeetMe into your website",
    icon: <Code2 className="h-6 w-6" />,
    href: "#"
  },
  {
    title: "Blog",
    description: "Stay up to date with the latest news and updates",
    icon: <Newspaper className="h-6 w-6" />,
    href: "/blog"
  },
  {
    title: "App Store",
    description: "Integrate with your favorite apps",
    logo: "/logos/google-calendar.png", // Using one of the logos as a sample for App Store or I could generate a generic grid one
    href: "#"
  },
  {
    title: "Out Of Office",
    description: "Schedule time off with ease",
    icon: <Moon className="h-6 w-6" />,
    href: "#"
  },
  {
    title: "Instant Meetings",
    description: "Meet with clients in minutes",
    icon: <Zap className="h-6 w-6" />,
    href: "#"
  },
  {
    title: "Collective Events",
    description: "Schedule events with multiple participants",
    icon: <Users className="h-6 w-6" />,
    href: "#"
  },
  {
    title: "Payments",
    description: "Accept payments for bookings",
    logo: "/logos/stripe.png",
    href: "#"
  },
  {
    title: "Dynamic Group Links",
    description: "Seamlessly book meetings with multiple people",
    icon: <LinkIcon className="h-6 w-6" />,
    href: "#"
  },
  {
    title: "Help Docs",
    description: "Need to learn more about our system? Check the help docs",
    icon: <FileText className="h-6 w-6" />,
    href: "#"
  },
  {
    title: "Workflows",
    description: "Automate scheduling and reminders",
    logo: "/logos/zapier.png",
    href: "#"
  },
  {
    title: "Webhooks",
    description: "Get notified when something happens",
    icon: <Webhook className="h-6 w-6" />,
    href: "#"
  },
  {
    title: "CRM Sync",
    description: "Automatically sync contacts with your favorite CRM",
    logo: "/logos/outlook.png",
    href: "#",
    comingSoon: true
  },
  {
    title: "Video Messaging",
    description: "Send personalized video messages to your clients",
    logo: "/logos/zoom.png",
    href: "#",
    comingSoon: true
  },
  {
    title: "Analytics Plus",
    description: "Deep dive into your scheduling data and insights",
    icon: <Search className="h-6 w-6" />,
    href: "#",
    comingSoon: true
  }
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
             <motion.h1 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
             >
               Resources \u0026 <span className="text-primary italic">Tools</span>
             </motion.h1>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
               Everything you need to integrate, automate, and optimize your scheduling.
             </p>
             <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search resources..." className="h-14 pl-12 rounded-2xl border-primary/20" />
             </div>
          </div>

          {/* Grid Layout from Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5"
          >
            <div className="grid md:grid-cols-3 gap-x-12 gap-y-10">
              {resources.map((item, i) => (
                <Link key={item.title} href={item.href} className={`group flex items-start ${item.comingSoon ? "pointer-events-none opacity-60" : ""}`}>
                  <div className="relative h-14 w-14 rounded-2xl bg-white border flex items-center justify-center mr-6 flex-shrink-0 group-hover:bg-primary/5 transition-colors shadow-sm overflow-hidden">
                    {/* Dot decorations from image style */}
                    <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-muted-foreground/10" />
                    <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-muted-foreground/10" />
                    <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-muted-foreground/10" />
                    <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-muted-foreground/10" />
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      {item.logo ? (
                        <img src={item.logo} alt={item.title} className="w-8 h-8 object-contain" />
                      ) : (
                        item.icon
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                      {item.comingSoon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Soon</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
          
          {/* CTA Section */}
          <div className="mt-24 bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <Webhook className="h-64 w-64 rotate-12" />
             </div>
             <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl font-bold mb-6 italic font-serif">Can&apos;t find what you&apos;re looking for?</h2>
                <p className="text-xl text-primary-foreground/80 mb-10">
                  Our team is always here to help. Whether you need technical support or just have a question about our features.
                </p>
                <Button variant="secondary" size="lg" className="rounded-full px-10 h-14 text-lg font-bold">Contact Support</Button>
             </div>
          </div>
        </div>
      </main>
      
      <footer className="py-12 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Knowledge Hub.
        </div>
      </footer>
    </div>
  );
}
