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
  ExternalLink
} from "lucide-react";
import { ConnectGoogleButton } from "@/components/dashboard/connect-google-button";
import { ConnectZoomButton } from "@/components/dashboard/connect-zoom-button";
import { ConnectSlackButton } from "@/components/dashboard/connect-slack-button";
import { ConnectZapierButton } from "@/components/dashboard/connect-zapier-button";
import { ConnectRazorpayButton } from "@/components/dashboard/connect-razorpay-button";
import { DisconnectAccountButton } from "@/components/dashboard/disconnect-account-button";
import { RequestIntegrationBanner } from "@/components/dashboard/request-integration-banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const slackIntegration = integrationsList.find(i => i.type === "slack");
  const zapierIntegration = integrationsList.find(i => i.type === "zapier");
  const razorpayIntegration = integrationsList.find(i => i.type === "razorpay");

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
      id: "razorpay",
      name: "Razorpay",
      description: "Accept payments for your bookings and paid events via Razorpay.",
      logo: "/logos/razorpay.svg",
      category: "business",
      isConnected: !!razorpayIntegration,
      component: <ConnectRazorpayButton isConnected={!!razorpayIntegration} />
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Power up your scheduling workflow with your favorite tools.</p>
        </div>
        <Button variant="outline" className="gap-2 text-xs font-bold uppercase tracking-wider">
          <ExternalLink className="h-3.5 w-3.5" />
          API Documentation
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 p-1 bg-muted/50 border rounded-2xl h-auto w-full md:w-fit flex flex-row flex-nowrap overflow-x-auto no-scrollbar gap-1 max-w-full">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="rounded-xl py-2.5 px-5 text-xs font-semibold data-[state=active]:shadow-sm flex-none shrink-0 md:flex-none flex items-center gap-2 whitespace-nowrap">
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="focus-visible:outline-none">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {integrations
                .filter(i => cat.id === "all" || i.category === cat.id)
                .map((item) => (
                  <Card key={item.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${item.isConnected ? "border-primary/20 bg-primary/5" : "bg-card"}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-white border flex items-center justify-center p-2.5 shadow-sm group-hover:scale-105 transition-transform">
                          <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        {item.comingSoon ? (
                          <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider border-zinc-200 dark:border-zinc-700">
                            Coming Soon
                          </Badge>
                        ) : item.isConnected ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                            Available
                          </Badge>
                        )}
                      </div>
                      <div className="pt-4">
                        <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1 text-xs leading-relaxed">
                          {item.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!item.comingSoon ? (
                        <div className="pt-2">
                          {item.component}
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full opacity-50 cursor-not-allowed text-xs font-bold" disabled>
                          Notify Me
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <RequestIntegrationBanner />
    </div>
  );
}
