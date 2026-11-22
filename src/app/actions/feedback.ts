"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyAdmin } from "@/app/actions/admin";

export interface FeedbackSubmission {
  id: string;
  timestamp: string;
  rating: number; // 1 to 5 stars
  category: "SCHEDULING" | "INTEGRATIONS" | "BILLING" | "TEAMS" | "PERFORMANCE" | "OTHER";
  feedback: string;
  desiredFeature?: string;
  userEmail?: string;
  userName?: string;
  userId?: string;
}

const feedbackStore: FeedbackSubmission[] = [];

export async function submitCustomerFeedback(data: {
  rating: number;
  category: FeedbackSubmission["category"];
  feedback: string;
  desiredFeature?: string;
}) {
  const session = await getServerSession(authOptions);

  const submission: FeedbackSubmission = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    rating: data.rating,
    category: data.category,
    feedback: data.feedback,
    desiredFeature: data.desiredFeature,
    userEmail: session?.user?.email || "anonymous",
    userName: session?.user?.name || "Anonymous",
    userId: (session?.user as any)?.id,
  };

  feedbackStore.unshift(submission);
  if (feedbackStore.length > 300) {
    feedbackStore.pop();
  }

  console.log(`[FEEDBACK] ${submission.rating}★ from ${submission.userEmail}: ${submission.feedback.substring(0, 60)}...`);

  return { success: true, message: "Thank you for your feedback! It directly shapes our roadmap." };
}

export async function getCustomerFeedbackList() {
  await verifyAdmin();
  return feedbackStore;
}
