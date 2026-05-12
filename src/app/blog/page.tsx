"use client";

import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const blogPosts = [
  {
    title: "Introducing MeetMe Sans: Our New Brand Typeface",
    description: "Designing a typeface that balances technical precision with human warmth.",
    category: "Brand",
    author: "Elena Rossi",
    date: "May 10, 2026",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80\u0026w=800\u0026auto=format\u0026fit=crop"
  },
  {
    title: "10 Workflows to Supercharge Your Sales Team",
    description: "How top sales organizations are using MeetMe to automate their entire funnel.",
    category: "Guides",
    author: "Marcus Chen",
    date: "May 5, 2026",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80\u0026w=800\u0026auto=format\u0026fit=crop"
  },
  {
    title: "MeetMe for Healthcare: Now HIPAA Compliant",
    description: "We're excited to announce our latest security milestone for healthcare providers.",
    category: "Product",
    author: "Sarah Johnson",
    date: "April 28, 2026",
    image: "https://images.unsplash.com/photo-1505751172107-596225a48805?q=80\u0026w=800\u0026auto=format\u0026fit=crop"
  },
  {
    title: "The Future of Remote Scheduling",
    description: "Predictions and trends that will shape how we connect in the next decade.",
    category: "Insights",
    author: "David Miller",
    date: "April 15, 2026",
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80\u0026w=800\u0026auto=format\u0026fit=crop"
  },
  {
    title: "How to Reduce Meeting No-Shows by 40%",
    description: "Simple strategies and automated reminders that actually work.",
    category: "Tips",
    author: "Lisa Wang",
    date: "April 2, 2026",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80\u0026w=800\u0026auto=format\u0026fit=crop"
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-16">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-8"
            >
              MeetMe <span className="text-primary italic font-serif">Blog</span>
            </motion.h1>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
               <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {["All", "Product", "Guides", "Insights", "Brand"].map(cat => (
                    <Button key={cat} variant={cat === "All" ? "default" : "outline"} className="rounded-full px-6">
                      {cat}
                    </Button>
                  ))}
               </div>
               <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search articles..." className="pl-10 rounded-xl" />
               </div>
            </div>
          </div>

          {/* Featured Post */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-12 mb-24 group cursor-pointer"
          >
             <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden border shadow-xl">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
             </div>
             <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">
                   <Tag className="h-3 w-3" /> {blogPosts[0].category}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight group-hover:text-primary transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {blogPosts[0].description}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                   <div className="flex items-center gap-2"><User className="h-4 w-4" /> {blogPosts[0].author}</div>
                   <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {blogPosts[0].date}</div>
                </div>
             </div>
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-20">
             {blogPosts.slice(1).map((post, i) => (
               <motion.div 
                 key={post.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="group cursor-pointer"
               >
                  <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border mb-8 shadow-lg">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
                     <span>{post.category}</span>
                     <span className="text-muted-foreground">\u2022</span>
                     <span className="text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2">
                    {post.description}
                  </p>
                  <Button variant="ghost" className="p-0 hover:bg-transparent group-hover:text-primary font-bold">
                    Read article <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </motion.div>
             ))}
          </div>

          {/* Newsletter */}
          <div className="mt-32 p-12 md:p-20 rounded-[3rem] bg-secondary/30 border text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-6 italic font-serif">Join the newsletter</h2>
             <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                Get the latest articles and product updates delivered straight to your inbox.
             </p>
             <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <Input placeholder="you@example.com" className="h-14 rounded-2xl bg-background" />
                <Button className="h-14 px-8 rounded-2xl font-bold">Subscribe</Button>
             </form>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t bg-muted/50 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetMe Inc. Editorial Team.
        </div>
      </footer>
    </div>
  );
}
