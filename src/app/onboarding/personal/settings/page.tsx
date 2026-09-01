import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata = {
  title: "Personal Settings | CalMeet Onboarding",
};

export default async function PersonalSettingsOnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/onboarding/personal/settings");
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
        accounts: {
          select: { provider: true },
        },
      },
    });
  } catch (error) {
    console.error("Personal settings fetch error:", error);
  }

  if (user?.completedOnboarding) {
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

  return <OnboardingWizard initialUser={initialUser} />;
}
