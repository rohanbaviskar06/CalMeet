"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blog-posts";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { toast } from "sonner";



export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubmittingNewsletter(true);
    try {
      const result = await subscribeToNewsletter(newsletterEmail);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully subscribed to our newsletter! Check your inbox.");
        setNewsletterEmail("");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              CalMeet <span className="text-primary italic font-serif">Blog</span>
            </motion.h1>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
               <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {["All", "Product", "Guides", "Insights", "Brand"].map(cat => (
                    <Button 
                      key={cat} 
                      variant={cat === selectedCategory ? "default" : "outline"} 
                      className="rounded-full px-6 transition-all"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
               </div>
               <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search articles..." 
                    className="pl-10 rounded-xl" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-[2.5rem] bg-muted/10">
              <h3 className="text-xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your keywords or category filters.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {filteredPosts.length > 0 && (
                <Link href={`/blog/${filteredPosts[0].slug}`} className="block mb-24">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={filteredPosts[0].title}
                    className="grid md:grid-cols-2 gap-12 group cursor-pointer"
                  >
                     <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden border shadow-xl relative">
                        <Image 
                          src={filteredPosts[0].image} 
                          alt={filteredPosts[0].title} 
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          priority
                        />
                     </div>
                     <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">
                           <Tag className="h-3 w-3" /> {filteredPosts[0].category}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight group-hover:text-primary transition-colors">
                          {filteredPosts[0].title}
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                          {filteredPosts[0].description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                           <div className="flex items-center gap-2"><User className="h-4 w-4" /> {filteredPosts[0].author}</div>
                           <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {filteredPosts[0].date}</div>
                        </div>
                     </div>
                  </motion.div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-20">
                 {filteredPosts.slice(1).map((post, i) => (
                   <Link href={`/blog/${post.slug}`} key={post.title} className="block group cursor-pointer">
                     <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.1 }}
                     >
                        <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border mb-8 shadow-lg relative">
                          <Image 
                            src={post.image} 
                            alt={post.title} 
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
                           <span>{post.category}</span>
                           <span className="text-muted-foreground">•</span>
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
                   </Link>
                 ))}
              </div>
            </>
          )}

          {/* Newsletter */}
          <div className="mt-32 p-12 md:p-20 rounded-[3rem] bg-secondary/30 border text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-6 italic font-serif">Join the newsletter</h2>
             <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                Get the latest articles and product updates delivered straight to your inbox.
             </p>
             <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
                <Input 
                  placeholder="you@example.com" 
                  className="h-14 rounded-2xl bg-background" 
                  required 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={isSubmittingNewsletter}
                />
                <Button 
                  className="h-14 px-8 rounded-2xl font-bold min-w-[140px]" 
                  type="submit" 
                  disabled={isSubmittingNewsletter}
                >
                  {isSubmittingNewsletter ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
             </form>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t bg-muted/50 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. Editorial Team.
        </div>
      </footer>
    </div>
  );
}
