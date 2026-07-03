"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import {
  User,
  Users,
  Network,
  Building2,
  Search,
  Zap,
  HeartHandshake,
  GraduationCap,
  Headphones,
  Stethoscope,
  Video,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { MobileDemo } from "@/components/landing/mobile-demo";
import { DashboardDemo } from "@/components/landing/dashboard-demo";

const teamSizeSolutions = [
  {
    title: "For Individuals",
    description: "Personal scheduling made simple",
    icon: <User className="h-6 w-6" />,
    href: "/solutions/individuals"
  },
  {
    title: "For Teams",
    description: "Collaborative scheduling for groups",
    icon: <Users className="h-6 w-6" />,
    href: "/solutions/teams"
  },
  {
    title: "For Organizations",
    description: "Larger teams scheduling for more control & security",
    icon: <Network className="h-6 w-6" />,
    href: "/solutions/organizations"
  },

];

const useCaseSolutions = [
  { title: "Recruiting", icon: <Search className="h-6 w-6" />, href: "/solutions/recruiting" },
  { title: "Sales", icon: <Zap className="h-6 w-6" />, href: "/solutions/sales" },
  { title: "HR", icon: <HeartHandshake className="h-6 w-6" />, href: "/solutions/hr" },
  { title: "Education", icon: <GraduationCap className="h-6 w-6" />, href: "/solutions/education" },
  { title: "Support", icon: <Headphones className="h-6 w-6" />, href: "/solutions/support" },
  { title: "Healthcare", icon: <Stethoscope className="h-6 w-6" />, href: "/solutions/healthcare" },


  { title: "Legal", icon: <Building2 className="h-6 w-6" />, href: "#", comingSoon: true },
  { title: "Real Estate", icon: <Search className="h-6 w-6" />, href: "#", comingSoon: true },
];

export default function SolutionsHubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-primary/5"
          >
            <div className="grid md:grid-cols-2 gap-16">
              {/* Team Size Column */}
              <div>
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">By team size</h2>
                <div className="space-y-8">
                  {teamSizeSolutions.map((item, i) => (
                    <Link key={item.title} href={item.href} className="flex group">
                      <div className="relative h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center mr-6 flex-shrink-0 group-hover:bg-primary/10 transition-colors border border-secondary">
                        {/* Dot decorations from image */}
                        <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground leading-snug">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Use Case Column */}
              <div>
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">By use case</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {useCaseSolutions.map((item, i) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`flex items-center group p-3 -m-3 rounded-2xl hover:bg-secondary/30 transition-colors ${item.comingSoon ? "pointer-events-none opacity-60" : ""}`}
                    >
                      <div className="relative h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mr-4 flex-shrink-0 border border-secondary">
                        <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-muted-foreground/20" />
                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold group-hover:text-primary transition-colors leading-tight">{item.title}</span>
                        {item.comingSoon && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Soon</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section below for "Show more content" part */}
          <div className="mt-20 space-y-24">
            <DashboardDemo />
            <MobileDemo />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
