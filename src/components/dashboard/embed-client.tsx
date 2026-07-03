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

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://calmeet.inc";

  const inlineCode = `<!-- CalMeet Inline Embed START -->
<div style="min-width:320px;height:700px;">
  <iframe src="${bookingUrl}?embed=true" width="100%" height="100%" frameborder="0"></iframe>
</div>
<!-- CalMeet Inline Embed END -->`;

  const popupCode = `<!-- CalMeet Floating Button START -->
<script src="${originUrl}/embed.js" async></script>
<script>
  window.onload = function() {
    CalMeet.initFloatingButton({
      url: "${bookingUrl}",
      text: "Book with me",
      color: "#006bff",
      textColor: "#ffffff"
    });
  }
</script>
<!-- CalMeet Floating Button END -->`;

  const clickCode = `<!-- CalMeet Popup via Element START -->
<script src="${originUrl}/embed.js" async></script>
<a href="" onclick="CalMeet.showPopup('${bookingUrl}'); return false;">
  Schedule time with me
</a>
<!-- CalMeet Popup via Element END -->`;

  const emailCode = `[Schedule time with me: ${eventTitle}](${bookingUrl})`;

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="inline" className="w-full">
        {/* Tab List */}
        <TabsList className="w-full flex bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 p-1 rounded-xl h-12">
          <TabsTrigger 
            value="inline" 
            className="flex-1 flex items-center justify-center gap-2 rounded-lg font-medium text-xs md:text-sm py-2 px-3 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 text-zinc-500 dark:text-zinc-400 cursor-pointer"
          >
            <Layout className="h-4 w-4" />
            <span>Inline Embed</span>
          </TabsTrigger>
          <TabsTrigger 
            value="popup" 
            className="flex-1 flex items-center justify-center gap-2 rounded-lg font-medium text-xs md:text-sm py-2 px-3 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 text-zinc-500 dark:text-zinc-400 cursor-pointer"
          >
            <MousePointer2 className="h-4 w-4" />
            <span>Floating Button</span>
          </TabsTrigger>
          <TabsTrigger 
            value="click" 
            className="flex-1 flex items-center justify-center gap-2 rounded-lg font-medium text-xs md:text-sm py-2 px-3 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 text-zinc-500 dark:text-zinc-400 cursor-pointer"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Element Click</span>
          </TabsTrigger>
          <TabsTrigger 
            value="email" 
            className="flex-1 flex items-center justify-center gap-2 rounded-lg font-medium text-xs md:text-sm py-2 px-3 transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 text-zinc-500 dark:text-zinc-400 cursor-pointer"
          >
            <Mail className="h-4 w-4" />
            <span>Email Embed</span>
          </TabsTrigger>
        </TabsList>

        {/* Inline Embed Tab */}
        <TabsContent value="inline" className="mt-6 focus-visible:outline-none">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Inline Embed</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
                Add the booking page directly to your website as part of the page content.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 px-6 pb-6">
              <div className="bg-zinc-950 dark:bg-black rounded-xl p-5 pt-12 relative border border-zinc-850/50 group">
                <Button 
                  size="sm" 
                  className="absolute top-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all h-8 px-3 text-xs font-medium cursor-pointer"
                  onClick={() => copyToClipboard(inlineCode, 'inline')}
                >
                  {copied === 'inline' ? <Check className="h-3.5 w-3.5 text-emerald-450 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  <span>{copied === 'inline' ? 'Copied!' : 'Copy Code'}</span>
                </Button>
                <pre className="text-zinc-300 text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{inlineCode}</code>
                </pre>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 text-sm text-zinc-650 dark:text-zinc-300">
                <Layout className="h-4.5 w-4.5 text-zinc-450 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Best for landing pages</strong> where you want users to pick a time directly. Fits seamlessly inside any section, container, or card on your page.
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Floating Button Tab */}
        <TabsContent value="popup" className="mt-6 focus-visible:outline-none">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Floating Pop-up Button</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
                Adds a floating button to the corner of your website that launches the booking widget in a lightbox overlay.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 px-6 pb-6">
              <div className="bg-zinc-950 dark:bg-black rounded-xl p-5 pt-12 relative border border-zinc-850/50 group">
                <Button 
                  size="sm" 
                  className="absolute top-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all h-8 px-3 text-xs font-medium cursor-pointer"
                  onClick={() => copyToClipboard(popupCode, 'popup')}
                >
                  {copied === 'popup' ? <Check className="h-3.5 w-3.5 text-emerald-450 mr-1 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  <span>{copied === 'popup' ? 'Copied!' : 'Copy Code'}</span>
                </Button>
                <pre className="text-zinc-300 text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{popupCode}</code>
                </pre>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 text-sm text-zinc-650 dark:text-zinc-300">
                <MousePointer2 className="h-4.5 w-4.5 text-zinc-450 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Quick Setup:</strong> Just insert this script block at the end of your HTML `&lt;body&gt;` tag. It will automatically load the assets and inject the button at the corner.
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Element Click Tab */}
        <TabsContent value="click" className="mt-6 focus-visible:outline-none">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Pop-up via Element Click</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
                Bind the booking popup action to any existing button, link, or component already built on your site.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 px-6 pb-6">
              <div className="bg-zinc-950 dark:bg-black rounded-xl p-5 pt-12 relative border border-zinc-850/50 group">
                <Button 
                  size="sm" 
                  className="absolute top-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all h-8 px-3 text-xs font-medium cursor-pointer"
                  onClick={() => copyToClipboard(clickCode, 'click')}
                >
                  {copied === 'click' ? <Check className="h-3.5 w-3.5 text-emerald-450 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  <span>{copied === 'click' ? 'Copied!' : 'Copy Code'}</span>
                </Button>
                <pre className="text-zinc-300 text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{clickCode}</code>
                </pre>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 text-sm text-zinc-650 dark:text-zinc-300">
                <ExternalLink className="h-4.5 w-4.5 text-zinc-450 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Total design freedom:</strong> Keep your site's custom layout. Just call `CalMeet.showPopup()` on click to load the booking overlay instantly.
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Embed Tab */}
        <TabsContent value="email" className="mt-6 focus-visible:outline-none">
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Email Embed</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
                Insert a scheduling hook or styled markdown link into your email newsletters, signature, or direct messages.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 px-6 pb-6">
              <div className="bg-zinc-950 dark:bg-black rounded-xl p-5 pt-12 relative border border-zinc-850/50 group">
                <Button 
                  size="sm" 
                  className="absolute top-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all h-8 px-3 text-xs font-medium cursor-pointer"
                  onClick={() => copyToClipboard(emailCode, 'email')}
                >
                  {copied === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-450 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  <span>{copied === 'email' ? 'Copied!' : 'Copy Link'}</span>
                </Button>
                <pre className="text-zinc-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                  <code>{emailCode}</code>
                </pre>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 text-sm text-zinc-650 dark:text-zinc-300">
                <Mail className="h-4.5 w-4.5 text-zinc-450 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Tip:</strong> This is a standard Markdown link ready for GitHub, Notion, or Slack. You can also customize the link text to say whatever fits your signature.
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
