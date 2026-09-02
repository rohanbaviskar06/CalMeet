"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  User, 
  Users, 
  Building2, 
  Zap, 
  Search, 
  HeartHandshake, 
  Headphones, 
  GraduationCap, 
  Stethoscope, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const teamSizes = [
  {
    title: "For Individuals",
    subtitle: "Solo Professionals & Creators",
    description: "Personal scheduling link, automated calendar sync, buffer times, and instant paid booking checkouts.",
    icon: User,
    href: "/solutions/individuals",
    badge: "Solo",
    features: ["Personal calmeet.com/you link", "Google Calendar 2-way sync", "Paid bookings via Razorpay/Stripe"]
  },
  {
    title: "For Teams",
    subtitle: "Agencies & Squads",
    description: "Round-robin distribution, collective availability, team routing, and shared scheduling infrastructure.",
    icon: Users,
    href: "/solutions/teams",
    badge: "Collaborative",
    features: ["Round-Robin lead assignment", "Multi-host collective meetings", "Team availability management"]
  },
  {
    title: "For Organizations",
    subtitle: "Scale & Enterprise",
    description: "Centralized admin management, SSO/SAML, custom domain white-labeling, audit logs, and compliance.",
    icon: Building2,
    href: "/solutions/organizations",
    badge: "Enterprise",
    features: ["White-label custom domains", "SSO & Role-based permissions", "Developer REST APIs & Webhooks"]
  },
];

const useCases = [
  {
    title: "Sales & Revenue",
    subtitle: "Close deals faster",
    description: "Qualify leads with routing forms and route hot prospects to available Account Executives in seconds.",
    icon: Zap,
    href: "/solutions/sales",
  },
  {
    title: "Recruiting & Talent",
    subtitle: "Frictionless candidate hiring",
    description: "Automate panel interviews, coordinate multiple interviewers, and eliminate candidate drop-offs.",
    icon: Search,
    href: "/solutions/recruiting",
  },
  {
    title: "Human Resources",
    subtitle: "Internal operations & 1-on-1s",
    description: "Streamline employee onboarding, performance reviews, benefits consultations, and team check-ins.",
    icon: HeartHandshake,
    href: "/solutions/hr",
  },
  {
    title: "Customer Support",
    subtitle: "High-touch customer care",
    description: "Offer tier-based support call scheduling, escalation rooms, and post-meeting CRM webhooks.",
    icon: Headphones,
    href: "/solutions/support",
  },
  {
    title: "Education & Academia",
    subtitle: "Office hours & student advising",
    description: "Manage professor office hours, student limit caps per time slot, and group academic advising.",
    icon: GraduationCap,
    href: "/solutions/education",
  },
  {
    title: "Healthcare & Telehealth",
    subtitle: "Private patient consultations",
    description: "Pre-appointment medical intake forms, buffer times between sessions, and private video rooms.",
    icon: Stethoscope,
    href: "/solutions/healthcare",
  },
];

export default function SolutionsHubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold mb-3 border border-zinc-200 dark:border-zinc-700">
              <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
              <span>Tailored Solutions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
              Scheduling built for how you work
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Explore how CalMeet streamlines meeting workflows across individuals, cross-functional teams, and specialized industries.
            </p>
          </div>

          {/* Section 1: By Team Size */}
          <div className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                  By Team Size
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Scale from solo creators to global enterprises.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {teamSizes.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-2xs group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                        {item.subtitle}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-3 mb-4">
                        {item.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: By Department & Industry */}
          <div className="mb-14">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                By Department & Industry
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Purpose-built workflows for revenue, operations, and specialized sectors.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {useCases.map((uc) => {
                const Icon = uc.icon;
                return (
                  <Link
                    key={uc.title}
                    href={uc.href}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {uc.title}
                        </h3>
                        <p className="text-[10px] text-zinc-400">
                          {uc.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                      {uc.description}
                    </p>

                    <div className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      View solution <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA Card */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">
                Need a customized setup for your team?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Talk with our scheduling specialists to build custom routing rules and integrations.
              </p>
            </div>
            <div className="flex gap-2">
              <Button render={<Link href="/signup" />} size="sm" className="h-9 px-4 text-xs font-semibold">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
