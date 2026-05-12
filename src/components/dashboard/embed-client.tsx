"use client";

import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Layout, 
  MousePointer2, 
  ExternalLink, 
  Mail 
} from "lucide-react";
import { toast } from "sonner";

export function EmbedClient({ bookingUrl, eventTitle }: { bookingUrl: string, eventTitle: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://meetme.inc";

  const inlineCode = `<!-- MeetMe Inline Embed START -->
<div style="min-width:320px;height:700px;">
  <iframe src="${bookingUrl}?embed=true" width="100%" height="100%" frameborder="0"></iframe>
</div>
<!-- MeetMe Inline Embed END -->`;

  const popupCode = `<!-- MeetMe Floating Button START -->
<script src="${originUrl}/embed.js" async></script>
<script>
  window.onload = function() {
    MeetMe.initFloatingButton({
      url: "${bookingUrl}",
      text: "Book with me",
      color: "#006bff",
      textColor: "#ffffff"
    });
  }
</script>
<!-- MeetMe Floating Button END -->`;

  const clickCode = `<!-- MeetMe Popup via Element START -->
<script src="${originUrl}/embed.js" async></script>
<a href="" onclick="MeetMe.showPopup('${bookingUrl}'); return false;">
  Schedule time with me
</a>
<!-- MeetMe Popup via Element END -->`;

  const emailCode = `[Schedule time with me: ${eventTitle}](${bookingUrl})`;

  return (
    <Tabs defaultValue="inline" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1 bg-muted/50 rounded-2xl">
        <TabsTrigger value="inline" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <Layout className="h-4 w-4" />
            <span className="text-xs">Inline Embed</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="popup" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <MousePointer2 className="h-4 w-4" />
            <span className="text-xs">Floating Button</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="click" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs">Element Click</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="email" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <Mail className="h-4 w-4" />
            <span className="text-xs">Email Embed</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="inline">
        <Card className="border-2 border-primary/10 overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle>Inline Embed</CardTitle>
            <CardDescription>
              Add the booking page directly to your website as part of the content.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-slate-950 rounded-2xl p-6 relative group">
              <pre className="text-slate-300 text-sm font-mono overflow-x-auto">
                <code>{inlineCode}</code>
              </pre>
              <Button 
                size="sm" 
                variant="secondary"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(inlineCode, 'inline')}
              >
                {copied === 'inline' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{copied === 'inline' ? 'Copied' : 'Copy Code'}</span>
              </Button>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
               <Layout className="h-4 w-4" />
               Best for landing pages where you want the user to stay on your site.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="popup">
        <Card className="border-2 border-primary/10 overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle>Floating Pop-up Button</CardTitle>
            <CardDescription>
              Adds a floating button to the corner of your website that opens the booking page in a popup.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-slate-950 rounded-2xl p-6 relative group">
              <pre className="text-slate-300 text-sm font-mono overflow-x-auto">
                <code>{popupCode}</code>
              </pre>
              <Button 
                size="sm" 
                variant="secondary"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(popupCode, 'popup')}
              >
                {copied === 'popup' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{copied === 'popup' ? 'Copied' : 'Copy Code'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="click">
        <Card className="border-2 border-primary/10 overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle>Pop up via Element Click</CardTitle>
            <CardDescription>
              Open the booking popup when a specific link or button on your site is clicked.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-slate-950 rounded-2xl p-6 relative group">
              <pre className="text-slate-300 text-sm font-mono overflow-x-auto">
                <code>{clickCode}</code>
              </pre>
              <Button 
                size="sm" 
                variant="secondary"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(clickCode, 'click')}
              >
                {copied === 'click' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{copied === 'click' ? 'Copied' : 'Copy Code'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card className="border-2 border-primary/10 overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle>Email Embed</CardTitle>
            <CardDescription>
              Add a booking link to your email signature or newsletter.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-slate-950 rounded-2xl p-6 relative group">
              <pre className="text-slate-300 text-sm font-mono overflow-x-auto">
                <code>{emailCode}</code>
              </pre>
              <Button 
                size="sm" 
                variant="secondary"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(emailCode, 'email')}
              >
                {copied === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{copied === 'email' ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-sm text-orange-800">
               Tip: This is a standard Markdown link. You can also just copy the URL directly.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
