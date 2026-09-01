"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Copy, 
  Check, 
  Layout, 
  MousePointer2, 
  ExternalLink, 
  Mail, 
  Code2, 
  Sparkles, 
  Eye, 
  Calendar, 
  Clock, 
  Palette, 
  Send,
  Monitor,
  Smartphone,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmbedClientProps {
  bookingUrl: string;
  eventTitle: string;
  duration?: number;
  username?: string;
}

export function EmbedClient({ bookingUrl, eventTitle, duration = 30, username = "user" }: EmbedClientProps) {
  const [copied, setCopied] = useState<string | null>(null);

  // Inline Customizer State
  const [inlineTheme, setInlineTheme] = useState<"auto" | "light" | "dark">("auto");
  const [inlineHeight, setInlineHeight] = useState("700px");
  const [codeType, setCodeType] = useState<"html" | "react" | "script">("html");

  // Floating Button Customizer State
  const [buttonText, setButtonText] = useState("Book with me");
  const [buttonColor, setButtonColor] = useState("#18181b");
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff");
  const [buttonPosition, setButtonPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");

  // Email Embed Customizer State
  const [emailEmbedType, setEmailEmbedType] = useState<"slots" | "button" | "markdown">("slots");
  const [emailSlotsCount, setEmailSlotsCount] = useState(3);
  const [emailSenderName, setEmailSenderName] = useState(username || "Me");

  const [originUrl, setOriginUrl] = useState("https://calmeet.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const cleanUrl = bookingUrl || `${originUrl}/${username}/${eventTitle.toLowerCase().replace(/\s+/g, "-")}`;

  // Generated Codes
  const inlineHtmlCode = `<!-- CalMeet Inline Embed START -->
<div style="min-width:320px;height:${inlineHeight};width:100%;">
  <iframe 
    src="${cleanUrl}?embed=true${inlineTheme !== "auto" ? `&theme=${inlineTheme}` : ""}" 
    width="100%" 
    height="100%" 
    frameborder="0"
    style="border:0;border-radius:12px;overflow:hidden;"
  ></iframe>
</div>
<!-- CalMeet Inline Embed END -->`;

  const inlineReactCode = `// React / Next.js Component
export default function BookingEmbed() {
  return (
    <div className="w-full h-[${inlineHeight}] min-w-[320px] rounded-xl overflow-hidden">
      <iframe
        src="${cleanUrl}?embed=true${inlineTheme !== "auto" ? `&theme=${inlineTheme}` : ""}"
        className="w-full h-full border-0"
        title="Schedule ${eventTitle}"
      />
    </div>
  );
}`;

  const floatingButtonCode = `<!-- CalMeet Floating Button START -->
<script src="${originUrl}/embed.js" async></script>
<script>
  window.addEventListener("DOMContentLoaded", function() {
    if (window.CalMeet) {
      window.CalMeet.initFloatingButton({
        url: "${cleanUrl}",
        text: "${buttonText}",
        color: "${buttonColor}",
        textColor: "${buttonTextColor}",
        position: "${buttonPosition}"
      });
    }
  });
</script>
<!-- CalMeet Floating Button END -->`;

  const elementClickCode = `<!-- CalMeet Popup Trigger START -->
<script src="${originUrl}/embed.js" async></script>
<button 
  type="button" 
  onclick="window.CalMeet && window.CalMeet.showPopup('${cleanUrl}')"
  style="background:#18181b;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;cursor:pointer;border:none;"
>
  Schedule ${eventTitle}
</button>
<!-- CalMeet Popup Trigger END -->`;

  // Dynamic sample days for email slot grid
  const sampleSlots = [
    { day: "Tomorrow", date: "9:00 AM", iso: "09:00" },
    { day: "Tomorrow", date: "11:30 AM", iso: "11:30" },
    { day: "Tomorrow", date: "2:00 PM", iso: "14:00" },
    { day: "In 2 Days", date: "10:00 AM", iso: "10:00" },
    { day: "In 2 Days", date: "1:00 PM", iso: "13:00" },
    { day: "In 2 Days", date: "3:30 PM", iso: "15:30" },
  ];

  // Rich HTML for Email Body
  const emailHtmlSlots = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:480px;border:1px solid #e4e4e7;border-radius:12px;padding:16px;background:#ffffff;">
  <tr>
    <td style="padding-bottom:12px;">
      <div style="font-size:14px;font-weight:700;color:#09090b;margin-bottom:2px;">📅 Schedule a meeting: ${eventTitle}</div>
      <div style="font-size:12px;color:#71717a;">${duration} mins · Select a time that works best for you:</div>
    </td>
  </tr>
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:4px;">
            <a href="${cleanUrl}?slot=tomorrow-0900" target="_blank" style="display:block;background:#f4f4f5;color:#18181b;text-decoration:none;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:600;text-align:center;border:1px solid #e4e4e7;">Tomorrow at 9:00 AM</a>
          </td>
          <td style="padding:4px;">
            <a href="${cleanUrl}?slot=tomorrow-1130" target="_blank" style="display:block;background:#f4f4f5;color:#18181b;text-decoration:none;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:600;text-align:center;border:1px solid #e4e4e7;">Tomorrow at 11:30 AM</a>
          </td>
        </tr>
        <tr>
          <td style="padding:4px;">
            <a href="${cleanUrl}?slot=day2-1000" target="_blank" style="display:block;background:#f4f4f5;color:#18181b;text-decoration:none;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:600;text-align:center;border:1px solid #e4e4e7;">In 2 Days at 10:00 AM</a>
          </td>
          <td style="padding:4px;">
            <a href="${cleanUrl}?slot=day2-1400" target="_blank" style="display:block;background:#f4f4f5;color:#18181b;text-decoration:none;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:600;text-align:center;border:1px solid #e4e4e7;">In 2 Days at 2:00 PM</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top:12px;text-align:center;">
      <a href="${cleanUrl}" target="_blank" style="font-size:11px;color:#2563eb;text-decoration:none;font-weight:600;">View full calendar & more dates →</a>
    </td>
  </tr>
</table>`;

  const emailHtmlButton = `<a href="${cleanUrl}" target="_blank" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
  📅 Schedule a meeting (${duration}m)
</a>`;

  const emailMarkdownLink = `[📅 Schedule time with me: ${eventTitle} (${duration}m)](${cleanUrl})`;

  const copyToClipboard = async (text: string, type: string, isRichHtml = false) => {
    try {
      if (isRichHtml && typeof ClipboardItem !== "undefined") {
        const htmlBlob = new Blob([text], { type: "text/html" });
        const textBlob = new Blob([text], { type: "text/plain" });
        const item = new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": textBlob,
        });
        await navigator.clipboard.write([item]);
        setCopied(type);
        toast.success("Formatted HTML copied! Paste directly into Gmail or Outlook.");
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        toast.success("Copied to clipboard!");
      }
    } catch (err) {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Copied code to clipboard!");
    } finally {
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="inline" className="w-full">
        {/* Modern Tabs Bar */}
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl h-11">
          <TabsTrigger
            value="inline"
            className="flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 text-zinc-500 transition-all shadow-none data-[state=active]:shadow-sm"
          >
            <Layout className="h-3.5 w-3.5" />
            <span>Inline Embed</span>
          </TabsTrigger>
          <TabsTrigger
            value="popup"
            className="flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 text-zinc-500 transition-all shadow-none data-[state=active]:shadow-sm"
          >
            <MousePointer2 className="h-3.5 w-3.5" />
            <span>Floating Button</span>
          </TabsTrigger>
          <TabsTrigger
            value="click"
            className="flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 text-zinc-500 transition-all shadow-none data-[state=active]:shadow-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Element Click</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 text-zinc-500 transition-all shadow-none data-[state=active]:shadow-sm"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Email Embed</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. INLINE EMBED */}
        <TabsContent value="inline" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customizer Column */}
            <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-card shadow-2xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Embed Options</h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <Label>Theme</Label>
                  <select
                    value={inlineTheme}
                    onChange={(e) => setInlineTheme(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs"
                  >
                    <option value="auto">Auto (Match Visitor)</option>
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Embed Height</Label>
                  <select
                    value={inlineHeight}
                    onChange={(e) => setInlineHeight(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs"
                  >
                    <option value="700px">700px (Default)</option>
                    <option value="600px">600px (Compact)</option>
                    <option value="800px">800px (Spacious)</option>
                    <option value="100%">100% (Responsive Parent)</option>
                  </select>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <Label>Framework / Language</Label>
                  <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg">
                    <button
                      onClick={() => setCodeType("html")}
                      className={cn(
                        "flex-1 py-1 rounded-md text-[11px] font-semibold transition-colors",
                        codeType === "html" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs" : "text-zinc-500"
                      )}
                    >
                      HTML
                    </button>
                    <button
                      onClick={() => setCodeType("react")}
                      className={cn(
                        "flex-1 py-1 rounded-md text-[11px] font-semibold transition-colors",
                        codeType === "react" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs" : "text-zinc-500"
                      )}
                    >
                      React/Next
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => copyToClipboard(codeType === "html" ? inlineHtmlCode : inlineReactCode, "inline")}
                  className="w-full h-8 text-xs font-semibold gap-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                >
                  {copied === "inline" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === "inline" ? "Copied Snippet!" : "Copy Embed Code"}</span>
                </Button>
              </div>
            </div>

            {/* Code Output & Live Preview (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-950 p-4 relative shadow-2xs group">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(codeType === "html" ? inlineHtmlCode : inlineReactCode, "inline-box")}
                  className="absolute top-3 right-3 h-7 px-2.5 text-xs bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
                >
                  {copied === "inline-box" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span className="ml-1">{copied === "inline-box" ? "Copied!" : "Copy"}</span>
                </Button>
                <div className="text-[10px] text-zinc-500 uppercase font-mono font-bold mb-2">
                  {codeType === "html" ? "HTML Snippet" : "React Component"}
                </div>
                <pre className="text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre leading-relaxed pr-16">
                  <code>{codeType === "html" ? inlineHtmlCode : inlineReactCode}</code>
                </pre>
              </div>

              {/* Live Preview Container */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-card shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-zinc-500" />
                    Live Embedded Preview
                  </span>
                  <a
                    href={cleanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="w-full h-[400px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background overflow-hidden">
                  <iframe
                    src={`${cleanUrl}?embed=true`}
                    className="w-full h-full border-0"
                    title="Live Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. FLOATING BUTTON EMBED */}
        <TabsContent value="popup" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-card shadow-2xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Button Customizer</h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <Label>Button Text</Label>
                  <Input
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Button Position</Label>
                  <select
                    value={buttonPosition}
                    onChange={(e) => setButtonPosition(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label>Background</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="w-7 h-7 rounded border-0 cursor-pointer p-0"
                      />
                      <span className="font-mono text-[11px] text-zinc-500">{buttonColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={buttonTextColor}
                        onChange={(e) => setButtonTextColor(e.target.value)}
                        className="w-7 h-7 rounded border-0 cursor-pointer p-0"
                      />
                      <span className="font-mono text-[11px] text-zinc-500">{buttonTextColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => copyToClipboard(floatingButtonCode, "floating")}
                  className="w-full h-8 text-xs font-semibold gap-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                >
                  {copied === "floating" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === "floating" ? "Copied Snippet!" : "Copy Floating Code"}</span>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-950 p-4 relative shadow-2xs">
                <div className="text-[10px] text-zinc-500 uppercase font-mono font-bold mb-2">
                  Floating Button Snippet
                </div>
                <pre className="text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{floatingButtonCode}</code>
                </pre>
              </div>

              {/* Simulation Box */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 bg-zinc-50/50 dark:bg-zinc-900/30 text-center relative min-h-[220px] flex flex-col items-center justify-center">
                <span className="text-xs text-zinc-400 mb-4 block">Interactive Website Preview</span>
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: buttonPosition === "bottom-right" ? "20px" : "auto",
                    left: buttonPosition === "bottom-left" ? "20px" : "auto",
                  }}
                >
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && (window as any).CalMeet) {
                        (window as any).CalMeet.showPopup(cleanUrl);
                      } else {
                        window.open(cleanUrl, "_blank");
                      }
                    }}
                    style={{
                      background: buttonColor,
                      color: buttonTextColor,
                    }}
                    className="px-4 py-2.5 rounded-full text-xs font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{buttonText}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. ELEMENT CLICK EMBED */}
        <TabsContent value="click" className="mt-6 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-4 shadow-2xs">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Launch Popup on Button Click</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Bind the scheduling modal popup to any existing button, nav link, or card on your website.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-950 p-4 relative">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(elementClickCode, "click")}
                className="absolute top-3 right-3 h-7 px-2.5 text-xs bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
              >
                {copied === "click" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span className="ml-1">{copied === "click" ? "Copied!" : "Copy Snippet"}</span>
              </Button>
              <pre className="text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre leading-relaxed pr-16">
                <code>{elementClickCode}</code>
              </pre>
            </div>
          </div>
        </TabsContent>

        {/* 4. EMAIL EMBED (UPGRADED & REFINED) */}
        <TabsContent value="email" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customizer Column */}
            <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-card shadow-2xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Email Format</h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <Label>Embed Style</Label>
                  <div className="space-y-1">
                    {[
                      { id: "slots", label: "Interactive Time Slots Grid", desc: "Clickable slots in email body" },
                      { id: "button", label: "Styled Scheduling Button", desc: "Clean signature CTA badge" },
                      { id: "markdown", label: "Plain Text / Markdown Link", desc: "For Slack, Notion, or simple emails" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setEmailEmbedType(item.id as any)}
                        className={cn(
                          "w-full text-left p-2.5 rounded-lg border text-xs transition-all",
                          emailEmbedType === item.id
                            ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium shadow-2xs"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50/50"
                        )}
                      >
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.label}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                {emailEmbedType === "slots" && (
                  <Button
                    onClick={() => copyToClipboard(emailHtmlSlots, "email-rich", true)}
                    className="w-full h-8 text-xs font-semibold gap-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  >
                    {copied === "email-rich" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied === "email-rich" ? "Copied Formatted HTML!" : "Copy for Gmail/Outlook"}</span>
                  </Button>
                )}

                {emailEmbedType === "button" && (
                  <Button
                    onClick={() => copyToClipboard(emailHtmlButton, "email-btn", true)}
                    className="w-full h-8 text-xs font-semibold gap-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  >
                    {copied === "email-btn" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied === "email-btn" ? "Copied Formatted Button!" : "Copy Signature Button"}</span>
                  </Button>
                )}

                {emailEmbedType === "markdown" && (
                  <Button
                    onClick={() => copyToClipboard(emailMarkdownLink, "email-md")}
                    className="w-full h-8 text-xs font-semibold gap-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  >
                    {copied === "email-md" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied === "email-md" ? "Copied Markdown!" : "Copy Markdown Link"}</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Email Composer Simulation (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-card shadow-2xs overflow-hidden">
                {/* Mock Email Header */}
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 ml-2">Email Composer Simulator</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Gmail / Outlook Ready</span>
                </div>

                {/* Mock Email Content Body */}
                <div className="p-6 space-y-4 text-xs font-sans">
                  <div className="space-y-1 text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                    <div><strong className="text-zinc-600 dark:text-zinc-300">To:</strong> client@example.com</div>
                    <div><strong className="text-zinc-600 dark:text-zinc-300">Subject:</strong> Let's connect: {eventTitle}</div>
                  </div>

                  <div className="space-y-3 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <p>Hi Alex,</p>
                    <p>Looking forward to our chat! Please choose a time on my calendar below:</p>

                    {/* RENDERED EMAIL EMBED VIEW */}
                    {emailEmbedType === "slots" && (
                      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 max-w-md shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            📅 {eventTitle}
                          </span>
                          <span className="text-[10px] text-zinc-400">{duration} mins</span>
                        </div>
                        <p className="text-[11px] text-zinc-500">Select a slot to schedule directly:</p>

                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`${cleanUrl}?slot=tomorrow-0900`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-center font-medium text-xs text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-800 block"
                          >
                            Tomorrow 9:00 AM
                          </a>
                          <a
                            href={`${cleanUrl}?slot=tomorrow-1130`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-center font-medium text-xs text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-800 block"
                          >
                            Tomorrow 11:30 AM
                          </a>
                          <a
                            href={`${cleanUrl}?slot=day2-1000`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-center font-medium text-xs text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-800 block"
                          >
                            In 2 Days 10:00 AM
                          </a>
                          <a
                            href={`${cleanUrl}?slot=day2-1400`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-center font-medium text-xs text-zinc-900 dark:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-800 block"
                          >
                            In 2 Days 2:00 PM
                          </a>
                        </div>

                        <div className="text-center pt-1">
                          <a
                            href={cleanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>View full calendar & more dates</span>
                            <ChevronRight className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {emailEmbedType === "button" && (
                      <div className="pt-2">
                        <a
                          href={cleanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Schedule {eventTitle} ({duration}m)</span>
                        </a>
                      </div>
                    )}

                    {emailEmbedType === "markdown" && (
                      <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 font-mono text-[11px] text-zinc-800 dark:text-zinc-200">
                        {emailMarkdownLink}
                      </div>
                    )}

                    <p className="pt-2 text-zinc-500">
                      Best regards,<br />
                      <strong>{emailSenderName}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
