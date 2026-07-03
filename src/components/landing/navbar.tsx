"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  ChevronDown, 
  User, 
  Users, 
  Zap, 
  Search, 
  GraduationCap, 
  Headphones, 
  ChevronRight,
  Newspaper,
  FileText,
  Smartphone, 
  CreditCard, 
  Network, 
  Code2,
  Webhook,
  HeartHandshake,
  BarChart3,
  Stethoscope,
  Video,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { status } = useSession();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <CalendarDays className="h-6 w-6" />
          <span>CalMeet</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <Link href="/solutions" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 py-4">
              Solutions
              <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" />
            </Link>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-popover border rounded-3xl shadow-2xl p-8 w-[600px] grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">By team size</h4>
                  <div className="space-y-4">
                    <Link href="/solutions/individuals" className="flex items-center gap-3 group/item">
                      <div className="p-2 rounded-lg bg-secondary group-hover/item:bg-primary/10 text-muted-foreground group-hover/item:text-primary transition-colors"><User className="h-4 w-4" /></div>
                      <div>
                        <div className="text-sm font-bold">For Individuals</div>
                        <div className="text-[10px] text-muted-foreground">Personal scheduling</div>
                      </div>
                    </Link>
                    <Link href="/solutions/teams" className="flex items-center gap-3 group/item">
                      <div className="p-2 rounded-lg bg-secondary group-hover/item:bg-primary/10 text-muted-foreground group-hover/item:text-primary transition-colors"><Users className="h-4 w-4" /></div>
                      <div>
                        <div className="text-sm font-bold">For Teams</div>
                        <div className="text-[10px] text-muted-foreground">Collaborative booking</div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">By use case</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/solutions/sales" className="flex items-center gap-2"><Zap className="h-3 w-3" /> Sales</Link>
                    <Link href="/solutions/recruiting" className="flex items-center gap-2"><Search className="h-3 w-3" /> Recruiting</Link>
                    <Link href="/solutions/education" className="flex items-center gap-2"><GraduationCap className="h-3 w-3" /> Education</Link>
                    <Link href="/solutions/support" className="flex items-center gap-2"><Headphones className="h-3 w-3" /> Support</Link>
                    <Link href="/solutions/hr" className="flex items-center gap-2"><HeartHandshake className="h-3 w-3" /> HR</Link>
                    <Link href="/solutions/healthcare" className="flex items-center gap-2"><Stethoscope className="h-3 w-3" /> Healthcare</Link>
                  </div>
                  <Link href="/solutions" className="mt-6 text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                    View all solutions <ChevronRight className="h-2 w-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          

          <div className="relative group">
            <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 py-4">
              Resources
              <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" />
            </Link>
            
            {/* Resources Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-popover border rounded-3xl shadow-2xl p-8 w-[700px] grid grid-cols-3 gap-8">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Content</h4>
                  <div className="space-y-4">
                    <Link href="/blog" className="flex items-center gap-3 group/item">
                      <div className="p-2 rounded-lg bg-secondary group-hover/item:bg-primary/10 text-muted-foreground group-hover/item:text-primary transition-colors"><Newspaper className="h-4 w-4" /></div>
                      <div>
                        <div className="text-sm font-bold">Blog</div>
                        <div className="text-[10px] text-muted-foreground">News & updates</div>
                      </div>
                    </Link>
                    <Link href="/resources/help-docs" className="flex items-center gap-3 group/item">
                      <div className="p-2 rounded-lg bg-secondary group-hover/item:bg-primary/10 text-muted-foreground group-hover/item:text-primary transition-colors"><FileText className="h-4 w-4" /></div>
                      <div>
                        <div className="text-sm font-bold">Help Docs</div>
                        <div className="text-[10px] text-muted-foreground">Guides & support</div>
                      </div>
                    </Link>
                    <Link href="/resources/embed" className="flex items-center gap-3 group/item">
                      <div className="p-2 rounded-lg bg-secondary group-hover/item:bg-primary/10 text-muted-foreground group-hover/item:text-primary transition-colors"><Code2 className="h-4 w-4" /></div>
                      <div>
                        <div className="text-sm font-bold">Embed</div>
                        <div className="text-[10px] text-muted-foreground">Add to your site</div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Features</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/resources/app-store" className="flex items-center gap-2"><Smartphone className="h-3 w-3" /> App Store</Link>
                    <Link href="/resources/payments" className="flex items-center gap-2"><CreditCard className="h-3 w-3" /> Payments</Link>
                    <Link href="/resources/workflows" className="flex items-center gap-2"><Network className="h-3 w-3" /> Workflows</Link>
                    <Link href="/resources/webhooks" className="flex items-center gap-2"><Webhook className="h-3 w-3" /> Webhooks</Link>
                    <Link href="/resources" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-1 mt-2 text-[10px] text-primary">View all <ChevronRight className="h-2 w-2" /></Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Support & Legal</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/support">Contact Support</Link>
                    <Link href="/security">Security</Link>
                    <Link href="/terms">Terms of Service</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/cookies">Cookie Policy</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
            ) : status === "authenticated" ? (
              <Link href="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
          {/* Mobile Menu Toggle Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t bg-background overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6 flex flex-col">
              <Link href="/solutions" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold border-b pb-2">Solutions</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold border-b pb-2">Blog</Link>
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold border-b pb-2">Pricing</Link>
              <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold border-b pb-2">Support</Link>
              
              <div className="flex flex-col gap-3 pt-4 sm:hidden">
                {status === "loading" ? (
                  <div className="h-11 bg-muted animate-pulse rounded-xl" />
                ) : status === "authenticated" ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-xl">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">Login</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
