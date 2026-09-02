"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDays, 
  Sparkles, 
  Users, 
  Building2, 
  Check, 
  Upload, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Globe,
  Video,
  ShieldCheck,
  Zap,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { saveOnboardingData } from "@/app/actions/onboarding";
import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface InitialUserData {
  id?: string;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  bio?: string | null;
  image?: string | null;
  plan?: string | null;
  connectedGoogle?: boolean;
  connectedZoom?: boolean;
}

export function OnboardingWizard({ 
  initialUser, 
  initialStep = 1 
}: { 
  initialUser: InitialUserData | null;
  initialStep?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Step: 1 = plan, 2 = details, 3 = calendar
  const resolveCurrentStep = () => {
    if (searchParams.get("step") === "3" || searchParams.get("step") === "calendar" || pathname?.includes("calendar")) return 3;
    if (searchParams.get("step") === "2" || searchParams.get("step") === "settings" || pathname?.includes("settings")) return 2;
    if (searchParams.get("step") === "1" || pathname?.includes("getting-started")) return 1;
    return initialStep || 1;
  };

  const [step, setStep] = useState<number>(resolveCurrentStep());

  React.useEffect(() => {
    setStep(resolveCurrentStep());
  }, [pathname, searchParams]);

  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedPlan, setSelectedPlan] = useState<string>(initialUser?.plan || "FREE");
  const [name, setName] = useState<string>(initialUser?.name || "");
  const [username, setUsername] = useState<string>(
    initialUser?.username || (initialUser?.email ? initialUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "") : "")
  );
  const [bio, setBio] = useState<string>(initialUser?.bio || "Let's find time to connect and discuss.");
  const [image, setImage] = useState<string>(initialUser?.image || "");
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [connectedCalendars, setConnectedCalendars] = useState<Record<string, boolean>>({
    google: initialUser?.connectedGoogle || false,
    outlook: false,
    zoom: initialUser?.connectedZoom || false,
    apple: false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.85);
            setImage(compressed);
            toast.success("Profile photo updated");
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlanContinue = async () => {
    setLoading(true);
    try {
      await saveOnboardingData({ plan: selectedPlan });
      setStep(2);
      router.push("/onboarding/personal/settings");
    } catch (err) {
      toast.error("Failed to save plan selection");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsContinue = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setLoading(true);
    try {
      await saveOnboardingData({
        name,
        username,
        bio,
        image
      });
      setStep(3);
      router.push("/onboarding/personal/calendar");
    } catch (err) {
      toast.error("Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await saveOnboardingData({
        plan: selectedPlan,
        name,
        username,
        bio,
        image,
        complete: true
      });
      toast.success("Welcome to CalMeet! Your workspace is ready.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error("Failed to complete onboarding");
      setLoading(false);
    }
  };

  const handleConnectCalendar = (provider: string) => {
    if (provider === "google") {
      signIn("google", { callbackUrl: "/onboarding/personal/calendar?step=3&google_connected=true" });
    } else {
      setConnectedCalendars(prev => ({ ...prev, [provider]: !prev[provider] }));
      toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} connected`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans select-none">
      {/* Top Brand Header & Progress */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 pt-2 pb-6">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90 transition">
          <CalendarDays className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
          <span>CalMeet</span>
        </Link>

        {/* Step Indicator Pill */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span className="text-zinc-900 dark:text-zinc-100 font-bold">Step {step} of 3</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span className="text-zinc-800 dark:text-zinc-200">
            {step === 1 ? "Choose Plan" : step === 2 ? "Profile & Booking" : "Integrations"}
          </span>
        </div>
      </header>

      {/* Main Glass Card Container */}
      <main className="w-full max-w-5xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl overflow-hidden flex flex-col z-10 my-auto min-h-[580px]">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: SELECT PLAN                                                      */}
          {/* ========================================================================= */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 flex-1"
            >
              {/* Left Column: Plan Options */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Personalize your experience</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                    How will you use CalMeet?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Select a plan tailored to your scheduling workflow. You can change plans at any time.
                  </p>

                  <div className="space-y-3.5">
                    {/* Option 1: Personal (Free) */}
                    <div
                      onClick={() => setSelectedPlan("FREE")}
                      className={`relative flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        selectedPlan === "FREE"
                          ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/20"
                          : "bg-muted/30 border-border/80 hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedPlan === "FREE" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-foreground">For Personal Use</span>
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">Free Forever</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Unlimited 1-on-1 bookings, customizable event types, and automatic calendar sync.
                          </p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        selectedPlan === "FREE" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                      }`}>
                        {selectedPlan === "FREE" && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Option 2: Pro (Team) */}
                    <div
                      onClick={() => setSelectedPlan("PRO")}
                      className={`relative flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        selectedPlan === "PRO"
                          ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/20"
                          : "bg-muted/30 border-border/80 hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedPlan === "PRO" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-foreground">With My Team</span>
                            <span className="bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full border border-primary/20">$12/mo</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Collective scheduling, round-robin team assignment, routing forms, and workflows.
                          </p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        selectedPlan === "PRO" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                      }`}>
                        {selectedPlan === "PRO" && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Option 3: Enterprise (Org) */}
                    <div
                      onClick={() => setSelectedPlan("ENTERPRISE")}
                      className={`relative flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        selectedPlan === "ENTERPRISE"
                          ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/20"
                          : "bg-muted/30 border-border/80 hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedPlan === "ENTERPRISE" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-foreground">For My Organization</span>
                            <span className="bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-violet-500/20">$28/mo</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Custom domains, SSO/SAML, advanced reporting, dedicated support, and security audit logs.
                          </p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        selectedPlan === "ENTERPRISE" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                      }`}>
                        {selectedPlan === "ENTERPRISE" && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Continue Button */}
                <div className="pt-8 flex justify-end">
                  <Button
                    onClick={handlePlanContinue}
                    disabled={loading}
                    className="h-11 px-8 rounded-full font-bold shadow-lg gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Dynamic Plan Preview Card */}
              <div className="lg:col-span-5 p-8 bg-muted/20 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="w-full max-w-sm bg-card border border-border/80 rounded-2xl p-6 shadow-xl relative z-10">
                  <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selected Plan</span>
                      <h4 className="text-lg font-bold text-foreground">
                        {selectedPlan === "FREE" ? "Personal Free" : selectedPlan === "PRO" ? "Team Pro" : "Enterprise"}
                      </h4>
                    </div>
                    <span className="text-xl font-extrabold text-primary">
                      {selectedPlan === "FREE" ? "$0" : selectedPlan === "PRO" ? "$12" : "$28"}
                      <span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{selectedPlan === "FREE" ? "1 Active Calendar Sync" : "Unlimited Calendar Connections"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{selectedPlan === "FREE" ? "Standard Meeting Durations" : "Round-Robin & Collective Slots"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{selectedPlan === "ENTERPRISE" ? "Custom Domain & SSO" : "Automated Email & Calendar Invites"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Google Meet & Zoom Integration</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Encrypted & Secure
                    </span>
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: PROFILE & BOOKING PAGE SETUP                                     */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 flex-1"
            >
              {/* Left Column: Profile Form */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Public Profile</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                    Set up your booking page
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    This is what invitees will see when they book time with you.
                  </p>

                  {/* Profile Picture */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-foreground mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 rounded-2xl border-2 border-border shadow-sm">
                        <AvatarImage src={image} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                          {name ? name.slice(0, 2).toUpperCase() : "CM"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground shadow-sm transition">
                          <Upload className="w-3.5 h-3.5 text-primary" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-muted-foreground mt-1">Recommended: Square image (PNG, JPG)</p>
                      </div>
                    </div>
                  </div>

                  {/* Your Name */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Full Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="rounded-xl h-11 bg-background"
                    />
                  </div>

                  {/* Username */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Booking Link Username
                    </label>
                    <div className="flex items-center rounded-xl border border-input bg-background px-3 h-11 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <span className="text-muted-foreground text-xs select-none">calmeet.com/</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                        placeholder="yourname"
                        className="w-full bg-transparent text-sm py-2 px-1 outline-none text-foreground"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Short Bio / Welcome Message
                    </label>
                    <Textarea
                      value={bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                      placeholder="Share a brief message about who you are and what you discuss."
                      rows={3}
                      className="rounded-xl bg-background resize-none"
                    />
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="pt-6 flex items-center justify-between border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep(1);
                      router.push("/onboarding/getting-started");
                    }}
                    className="rounded-full gap-1.5 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={handleDetailsContinue}
                    disabled={loading}
                    className="h-11 px-8 rounded-full font-bold shadow-lg gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Live CalMeet Booking Preview */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-muted/20 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                  {/* Browser Bar */}
                  <div className="px-4 py-2.5 border-b border-border/80 flex items-center gap-2 bg-muted/40">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="flex-1 text-center bg-background/80 py-0.5 px-2 rounded-md text-[11px] text-muted-foreground truncate border border-border/60">
                      calmeet.com/{username || "yourname"}
                    </div>
                  </div>

                  {/* Profile Header */}
                  <div className="p-5 pb-3 border-b border-border/60 text-center">
                    <Avatar className="w-14 h-14 rounded-2xl mx-auto border-2 border-primary/20 shadow-md mb-2.5">
                      <AvatarImage src={image} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-extrabold text-sm">
                        {name ? name.slice(0, 2).toUpperCase() : "CM"}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-base text-foreground truncate">
                      {name || "Your Name"}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 px-2">
                      {bio || "Let's find time to connect."}
                    </p>
                  </div>

                  {/* Sample Event Types */}
                  <div className="p-4 space-y-2">
                    {[
                      { title: "15 Min Quick Chat", duration: "15m", icon: Clock },
                      { title: "30 Min Discovery", duration: "30m", icon: Video },
                      { title: "60 Min Strategy", duration: "60m", icon: Sparkles }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-background/60 hover:bg-muted/40 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <item.icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-foreground block">{item.title}</span>
                            <span className="text-[10px] text-muted-foreground">{item.duration} • Google Meet</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                          Book
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: CONNECT YOUR CALENDAR                                            */}
          {/* ========================================================================= */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 flex-1"
            >
              {/* Left Column: Integrations List */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Calendar & Meetings</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                    Connect your schedule
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Prevent double-bookings by connecting your existing calendars and video conferencing tools.
                  </p>

                  <div className="space-y-3">
                    {/* Google Calendar */}
                    <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20">
                          31
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">Google Calendar</span>
                            {connectedCalendars.google && (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" /> Connected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Auto-sync events and create Google Meet links</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={connectedCalendars.google ? "secondary" : "outline"}
                        onClick={() => handleConnectCalendar("google")}
                        className="rounded-full px-4 text-xs font-semibold"
                      >
                        {connectedCalendars.google ? "Connected" : "Connect"}
                      </Button>
                    </div>

                    {/* Zoom */}
                    <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-600/20">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">Zoom Meetings</span>
                            {connectedCalendars.zoom && (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Connected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Generate Zoom links automatically for new bookings</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConnectCalendar("zoom")}
                        className="rounded-full px-4 text-xs font-semibold"
                      >
                        {connectedCalendars.zoom ? "Connected" : "Connect"}
                      </Button>
                    </div>

                    {/* Microsoft Outlook */}
                    <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm border border-sky-500/20">
                          O
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">Outlook Calendar</span>
                            {connectedCalendars.outlook && (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Connected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Sync your Microsoft 365 and Outlook events</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConnectCalendar("outlook")}
                        className="rounded-full px-4 text-xs font-semibold"
                      >
                        {connectedCalendars.outlook ? "Connected" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="pt-6 flex items-center justify-between border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep(2);
                      router.push("/onboarding/personal/settings");
                    }}
                    className="rounded-full gap-1.5 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      onClick={handleComplete}
                      disabled={loading}
                      className="rounded-full text-xs text-muted-foreground hover:text-foreground"
                    >
                      Skip for now
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={loading}
                      className="h-11 px-8 rounded-full font-bold shadow-lg gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Finish Setup <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Weekly Schedule Card */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-muted/20 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                    <div>
                      <span className="text-xs font-bold text-foreground block">Weekly Availability</span>
                      <span className="text-[11px] text-muted-foreground">{timezone}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      Mon – Fri, 9:00am - 5:00pm
                    </span>
                  </div>

                  {/* Day Blocks */}
                  <div className="space-y-2">
                    {[
                      { day: "Mon", time: "9:00 AM - 5:00 PM", status: "Active" },
                      { day: "Tue", time: "9:00 AM - 5:00 PM", status: "Active" },
                      { day: "Wed", time: "9:00 AM - 5:00 PM", status: "Active" },
                      { day: "Thu", time: "9:00 AM - 5:00 PM", status: "Active" },
                      { day: "Fri", time: "9:00 AM - 5:00 PM", status: "Active" },
                      { day: "Sat / Sun", time: "Unavailable", status: "Off" }
                    ].map((slot, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/30 border border-border/40">
                        <span className="font-semibold text-foreground">{slot.day}</span>
                        <span className="text-muted-foreground text-[11px]">{slot.time}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          slot.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                        }`}>
                          {slot.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 pt-4 text-xs text-muted-foreground">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hover:text-foreground transition underline underline-offset-4"
        >
          Sign out
        </button>
        <p>© {new Date().getFullYear()} CalMeet. All rights reserved.</p>
      </footer>
    </div>
  );
}
