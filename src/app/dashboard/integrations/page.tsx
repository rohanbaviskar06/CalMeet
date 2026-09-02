import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  Calendar as CalendarIcon, 
  Video, 
  Briefcase, 
  Search,
  ExternalLink,
  Code2
} from "lucide-react";
import { ConnectGoogleButton } from "@/components/dashboard/connect-google-button";
import { ConnectZoomButton } from "@/components/dashboard/connect-zoom-button";
import { ConnectSlackButton } from "@/components/dashboard/connect-slack-button";
import { ConnectZapierButton } from "@/components/dashboard/connect-zapier-button";
import { ConnectICloudModal } from "@/components/dashboard/connect-icloud-modal";
import { DisconnectAccountButton } from "@/components/dashboard/disconnect-account-button";
import { RequestIntegrationBanner } from "@/components/dashboard/request-integration-banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const [accounts, integrationsList] = await Promise.all([
    prisma.account.findMany({
      where: { userId: (session.user as any).id }
    }),
    prisma.integration.findMany({
      where: { userId: (session.user as any).id }
    })
  ]);

  const googleAccount = accounts.find(a => a.provider === "google");
  const zoomAccount = accounts.find(a => a.provider === "zoom");
  const icloudIntegration = integrationsList.find(i => i.type === "icloud");
  const slackIntegration = integrationsList.find(i => i.type === "slack");
  const zapierIntegration = integrationsList.find(i => i.type === "zapier");

  const categories = [
    {
      id: "all",
      label: "All Integrations",
      icon: Search
    },
    {
      id: "calendars",
      label: "Calendars",
      icon: CalendarIcon
    },
    {
      id: "video",
      label: "Video",
      icon: Video
    },
    {
      id: "business",
      label: "Business",
      icon: Briefcase
    }
  ];

  const integrations = [
    {
      id: "google",
      name: "Google Calendar & Meet",
      description: "Sync your availability and create Google Meet links automatically.",
      logo: "/logos/google-calendar.svg",
      category: "calendars",
      isConnected: !!googleAccount,
      component: googleAccount ? (
        <DisconnectAccountButton provider="google" providerName="Google Calendar" />
      ) : (
        <ConnectGoogleButton />
      )
    },
    {
      id: "icloud",
      name: "Apple iCloud Calendar",
      description: "Sync your Apple Calendar directly using secure CalDAV protocol.",
      logo: "/logos/apple.svg",
      category: "calendars",
      isConnected: !!icloudIntegration,
      component: <ConnectICloudModal isConnected={!!icloudIntegration} />
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Generate Zoom meeting links for your bookings automatically.",
      logo: "/logos/zoom.svg",
      category: "video",
      isConnected: !!zoomAccount,
      component: zoomAccount ? (
        <DisconnectAccountButton provider="zoom" providerName="Zoom" />
      ) : (
        <ConnectZoomButton />
      )
    },
    {
      id: "outlook",
      name: "Microsoft Outlook",
      description: "Sync with your Outlook/Office 365 calendar and tasks.",
      logo: "/logos/outlook.png",
      category: "calendars",
      comingSoon: true
    },
    {
      id: "teams",
      name: "Microsoft Teams",
      description: "Create Microsoft Teams meeting links for your bookings.",
      logo: "/logos/teams.png",
      category: "video",
      comingSoon: true
    },
    {
      id: "slack",
      name: "Slack Webhook Notifications",
      description: "Receive instant notifications in Slack when a new booking is scheduled.",
      logo: "/logos/slack.svg",
      category: "business",
      isConnected: !!slackIntegration,
      component: <ConnectSlackButton isConnected={!!slackIntegration} />
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments for your bookings and paid events.",
      logo: "/logos/stripe.png",
      category: "business",
      comingSoon: true
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect CalMeet with 6,000+ apps. Trigger Zaps on every new booking.",
      logo: "/logos/zapier.svg",
      category: "business",
      isConnected: !!zapierIntegration,
      component: <ConnectZapierButton isConnected={!!zapierIntegration} />
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Integrations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Connect your calendar, video conferencing, and business apps.
          </p>
        </div>

        <Link href="/resources/api-docs">
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 px-3.5 gap-2 text-xs font-semibold rounded-xl border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-2xs"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>API Documentation</span>
            <ExternalLink className="h-3 w-3 text-zinc-400" />
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full space-y-6">
        <TabsList className="p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl h-auto w-full sm:w-fit flex flex-row flex-nowrap overflow-x-auto no-scrollbar gap-1">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id} 
              className="rounded-lg py-1.5 px-3.5 text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-2xs flex-none shrink-0 flex items-center gap-2 cursor-pointer transition-all"
            >
              <cat.icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="focus-visible:outline-none">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {integrations
                .filter(i => cat.id === "all" || i.category === cat.id)
                .map((item) => (
                  <div 
                    key={item.id} 
                    className={`rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xs flex flex-col justify-between transition-all hover:border-zinc-300 dark:hover:border-zinc-700 ${
                      item.isConnected ? "ring-1 ring-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10" : ""
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center p-2 shadow-2xs">
                          <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        {item.comingSoon ? (
                          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-zinc-200/80 dark:border-zinc-700">
                            Coming Soon
                          </span>
                        ) : item.isConnected ? (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Connected
                          </span>
                        ) : (
                          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-zinc-200/60 dark:border-zinc-700">
                            Available
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {item.name}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-200/80 dark:border-zinc-800">
                      {!item.comingSoon ? (
                        <div>
                          {item.component}
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full opacity-50 cursor-not-allowed text-xs font-semibold h-8 rounded-xl border-zinc-200 dark:border-zinc-800" 
                          disabled
                        >
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <RequestIntegrationBanner />
    </div>
  );
}
