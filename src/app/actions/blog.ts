"use server";

import { sendNewBlogNotification } from "@/app/actions/newsletter";
import { blogPosts } from "@/data/blog-posts";

export async function publishBlogAndNotifySubscribers(slug: string) {
  try {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) {
      console.error(`Blog post with slug ${slug} not found.`);
      return { error: "Blog post not found." };
    }

    console.log(`Broadcasting email notification for blog post: ${post.title}`);
    
    // Broadcast notification to all newsletter subscribers
    await sendNewBlogNotification({
      title: post.title,
      slug: post.slug,
      description: post.description,
      category: post.category,
      author: post.author,
      image: post.image,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Publish & notify error:", error);
    return { error: error.message || "Failed to notify subscribers" };
  }
}
