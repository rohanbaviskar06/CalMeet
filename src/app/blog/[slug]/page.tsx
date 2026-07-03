import { blogPosts } from "@/data/blog-posts";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    return {
      title: "Article Not Found | CalMeet",
    };
  }

  return {
    title: `${post.title} | CalMeet Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to articles
          </Link>

          {/* Article Header */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em]">
              <Tag className="h-3.5 w-3.5" /> {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>
            <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground border-y py-4 border-muted/60">
              <div className="flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-primary/70" />
                <span className="font-semibold text-foreground">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-primary/70" />
                <span>{post.date}</span>
              </div>
            </div>
          </div>

          {/* Feature Image */}
          <div className="aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden border shadow-xl relative mb-12 bg-muted">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed text-muted-foreground font-normal">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Bottom Call to Action */}
          <div className="mt-16 pt-12 border-t text-center space-y-6">
            <h3 className="text-xl font-bold">Ready to streamline your scheduling?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Join thousands of professionals who save hours of work every single week with CalMeet automation.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link href="/signup">
                <Button className="rounded-xl px-6 font-bold">Get Started Free</Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" className="rounded-xl px-6 font-bold">More Articles</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t bg-muted/50 mt-24">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CalMeet Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
