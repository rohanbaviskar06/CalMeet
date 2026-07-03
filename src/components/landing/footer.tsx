"use client";

import Link from "next/link";
import { Mail, Shield, FileText, Lock, HelpCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 border-t bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">M</div>
              <span>CalMeet</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              CalMeet helps you connect with people when it matters. Automate your meetings, 
              sync your calendars, and reclaim your time.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link href="/resources" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/integrations" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-primary transition-colors">Live Demo</Link></li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">Solutions</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link href="/solutions/individuals" className="hover:text-primary transition-colors">For Individuals</Link></li>
              <li><Link href="/solutions/teams" className="hover:text-primary transition-colors">For Teams</Link></li>
              <li><Link href="/solutions/sales" className="hover:text-primary transition-colors">Sales</Link></li>
              <li><Link href="/solutions/recruiting" className="hover:text-primary transition-colors">Recruiting</Link></li>
            </ul>
          </div>

          {/* Support & Legal Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">Support & Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li>
                <Link href="/support" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" /> Contact Support
                </Link>
              </li>
              <li>
                <Link href="/security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground font-medium">
          <p>© {currentYear} CalMeet Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">Twitter</Link>
            <Link href="#" className="hover:text-primary">LinkedIn</Link>
            <Link href="#" className="hover:text-primary">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
