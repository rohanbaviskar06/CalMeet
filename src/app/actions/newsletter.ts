"use server";

import { sendEmail } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

export async function subscribeToNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address." };
  }

  try {
    // 1. Save subscriber in database
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!existing) {
      await prisma.newsletterSubscriber.create({
        data: { email },
      });
    }

    // 2. Send confirmation email
    await sendEmail({
      to: email,
      subject: "You're Subscribed! 📧",
      fromName: "CalMeet Newsletter",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px;">
          <h2 style="color: #0F172A; margin-bottom: 16px;">CalMeet Newsletter</h2>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            Thanks for subscribing to the CalMeet Newsletter!
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 24px;">
            You will now receive weekly product updates, scheduling tips, and workflow automation guides directly in your inbox.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">If you didn't subscribe, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log("Newsletter subscription email sent and stored for:", email);
    return { success: true };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return { error: error.message || "Failed to subscribe" };
  }
}

export async function sendNewBlogNotification(post: {
  title: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  image: string;
}) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    // Get all subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      select: { email: true }
    });

    if (subscribers.length === 0) {
      console.log("No subscribers to notify.");
      return;
    }

    console.log(`Sending new blog notification to ${subscribers.length} subscribers.`);

    // Send emails in parallel batches using the sendEmail helper
    await Promise.all(
      subscribers.map((sub: { email: string }) =>
        sendEmail({
          to: sub.email,
          subject: `New Article: ${post.title} 📝`,
          fromName: "CalMeet Blog",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px;">
              <span style="background-color: #f1f5f9; color: #4f46e5; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">${post.category}</span>
              <h2 style="color: #0F172A; margin-top: 12px; margin-bottom: 8px;">${post.title}</h2>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">By ${post.author}</p>
              
              <img src="${post.image}" alt="${post.title}" style="width: 100%; border-radius: 8px; margin-bottom: 16px; object-fit: cover; aspect-ratio: 16/9;" />
              
              <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
                ${post.description}
              </p>
              
              <a href="${baseUrl}/blog/${post.slug}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; text-align: center;">Read Full Article</a>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
              <p style="color: #94a3b8; font-size: 12px;">You received this because you subscribed to CalMeet updates. </p>
            </div>
          `,
        }).catch((err) => console.error(`Error sending blog email to ${sub.email}:`, err))
      )
    );
  } catch (error) {
    console.error("Failed to send blog broadcast notification:", error);
  }
}
