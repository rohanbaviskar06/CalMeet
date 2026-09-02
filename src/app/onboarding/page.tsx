import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata = {
  title: "Onboarding | CalMeet",
  description: "Get started with your CalMeet workspace",
};

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/onboarding");
  }

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        plan: true,
        completedOnboarding: true,
        _count: {
          select: { eventTypes: true },
        },
        accounts: {
          select: { provider: true },
        },
      },
    });
  } catch (error) {
    console.error("Onboarding page user fetch error:", error);
  }

  // If the user has already completed onboarding (or already has existing events), forward directly to dashboard
  if (user?.completedOnboarding || (user?._count?.eventTypes && user._count.eventTypes > 0)) {
    redirect("/dashboard");
  }

  const initialUser = user
    ? {
        ...user,
        connectedGoogle: user.accounts.some((a) => a.provider === "google"),
      }
    : {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      };

  return <OnboardingWizard initialUser={initialUser} initialStep={1} />;
}
