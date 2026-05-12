import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { ConnectGoogleButton } from "@/components/dashboard/connect-google-button";
import { ConnectZoomButton } from "@/components/dashboard/connect-zoom-button";

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const accounts = await prisma.account.findMany({
    where: { userId: (session.user as any).id }
  });

  const googleAccount = accounts.find(a => a.provider === "google");
  const zoomAccount = accounts.find(a => a.provider === "zoom");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect your calendar and other tools to sync your events.</p>
      </div>

      <div className="grid gap-6">
        {/* Google Calendar Integration */}
        <Card className={googleAccount ? "border-primary/20 bg-primary/5" : ""}>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
              <img src="/logos/google-calendar.png" alt="Google Calendar" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">Google Calendar & Meet</CardTitle>
              <CardDescription>Sync your availability and create Google Meet links automatically.</CardDescription>
            </div>
            {googleAccount ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="px-3 py-1 text-muted-foreground">
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                Not Connected
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              {googleAccount 
                ? `Connected as ${session.user.email}. All bookings will be added to your primary calendar and include a Google Meet link.`
                : "Connect your Google account to enable calendar sync and automated Google Meet meetings."}
            </div>
            {googleAccount ? (
              <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/5" disabled>
                Disconnect
              </Button>
            ) : (
              <ConnectGoogleButton />
            )}
          </CardContent>
        </Card>

        {/* Zoom Integration */}
        <Card className={zoomAccount ? "border-primary/20 bg-primary/5" : ""}>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
              <img src="/logos/zoom.png" alt="Zoom" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">Zoom</CardTitle>
              <CardDescription>Generate Zoom meeting links for your bookings.</CardDescription>
            </div>
            {zoomAccount ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="px-3 py-1 text-muted-foreground">
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                Not Connected
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              {zoomAccount 
                ? "Zoom account connected. You can now use Zoom as a location for your event types."
                : "Connect your Zoom account to generate video call links automatically."}
            </div>
            {zoomAccount ? (
              <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/5" disabled>
                Disconnect
              </Button>
            ) : (
              <ConnectZoomButton />
            )}
          </CardContent>
        </Card>

        <Card className="opacity-60 border-dashed">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 opacity-50">
                <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
                    <img src="/logos/outlook.png" alt="Outlook" className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-xl">Microsoft Outlook</CardTitle>
                    <CardDescription>Sync with your Outlook/Office 365 calendar.</CardDescription>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
            </CardHeader>
        </Card>

        <Card className="opacity-60 border-dashed">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 opacity-50">
                <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
                    <img src="/logos/teams.png" alt="Teams" className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-xl">Microsoft Teams</CardTitle>
                    <CardDescription>Create Microsoft Teams meeting links for your bookings.</CardDescription>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
            </CardHeader>
        </Card>

        <Card className="opacity-60 border-dashed">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 opacity-50">
                <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
                    <img src="/logos/slack.png" alt="Slack" className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-xl">Slack</CardTitle>
                    <CardDescription>Get notifications and book meetings directly from Slack.</CardDescription>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
            </CardHeader>
        </Card>

        <Card className="opacity-60 border-dashed">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 opacity-50">
                <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
                    <img src="/logos/stripe.png" alt="Stripe" className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-xl">Stripe</CardTitle>
                    <CardDescription>Accept payments for your bookings and events.</CardDescription>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
            </CardHeader>
        </Card>

        <Card className="opacity-60 border-dashed">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 opacity-50">
                <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center overflow-hidden">
                    <img src="/logos/zapier.png" alt="Zapier" className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-xl">Zapier</CardTitle>
                    <CardDescription>Connect MeetMe with thousands of other apps via Zapier.</CardDescription>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
            </CardHeader>
        </Card>
      </div>
    </div>
  );
}
