"use client";

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
  Code2
} from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <CalendarDays className="h-6 w-6" />
          <span>MeetMe</span>
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
                    <Link href="/solutions/sales" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"><Zap className="h-3 w-3" /> Sales</Link>
                    <Link href="/solutions/recruiting" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"><Search className="h-3 w-3" /> Recruiting</Link>
                    <Link href="/solutions/education" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"><GraduationCap className="h-3 w-3" /> Education</Link>
                    <Link href="/solutions/support" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"><Headphones className="h-3 w-3" /> Support</Link>
                  </div>
                  <Link href="/solutions" className="mt-6 text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                    View all solutions <ChevronRight className="h-2 w-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/enterprise" className="text-sm font-medium hover:text-primary transition-colors">Enterprise</Link>
          <div className="relative group">
            <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 py-4">
              Resources
              <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" />
            </Link>
            
            {/* Resources Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-popover border rounded-3xl shadow-2xl p-8 w-[500px] grid grid-cols-2 gap-8">
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
                    <Link href="/resources" className="flex items-center gap-3 group/item">
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
                    <Link href="/resources" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"><Smartphone className="h-3 w-3" /> App Store</Link>
                    <Link href="/resources" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"><CreditCard className="h-3 w-3" /> Payments</Link>
                    <Link href="/resources" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"><Network className="h-3 w-3" /> Workflows</Link>
                    <Link href="/resources" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-1 mt-2 text-[10px] text-primary">View all <ChevronRight className="h-2 w-2" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
