"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDays, 
  Check, 
  Upload, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Video,
  User,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

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
  
  const resolveCurrentStep = () => {
    if (searchParams.get("step") === "3" || searchParams.get("step") === "calendar" || pathname?.includes("calendar")) return 3;
    if (searchParams.get("step") === "2" || searchParams.get("step") === "settings" || pathname?.includes("settings")) return 2;
    if (searchParams.get("step") === "1" || pathname?.includes("getting-started")) return 1;
    return initialStep || 1;
  };

  const [step, setStep] = useState<number>(resolveCurrentStep());

  useEffect(() => {
    setStep(resolveCurrentStep());
  }, [pathname, searchParams]);

  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedPlan, setSelectedPlan] = useState<string>(initialUser?.plan || "FREE");
  const [name, setName] = useState<string>(initialUser?.name || "");
  const [username, setUsername] = useState<string>(
    initialUser?.username || (initialUser?.email ? initialUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "") : "")
  );
  const [bio, setBio] = useState<string>(initialUser?.bio || "Let's find time to connect.");
  const [image, setImage] = useState<string>(initialUser?.image || "");
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );
  const [connectedCalendars, setConnectedCalendars] = useState<Record<string, boolean>>({
    google: initialUser?.connectedGoogle || false,
    outlook: false,
    zoom: initialUser?.connectedZoom || false,
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
      toast.success("Welcome to CalMeet! Workspace is configured.");
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
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans">
      {/* Top Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
          <div className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
          <span>CalMeet</span>
        </Link>

        {/* Linear Step Progression */}
        <div className="flex items-center gap-1 sm:gap-3 text-xs">
          {[
            { num: 1, label: "Plan", path: "/onboarding/getting-started" },
            { num: 2, label: "Profile & URL", path: "/onboarding/personal/settings" },
            { num: 3, label: "Calendar", path: "/onboarding/personal/calendar" },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              {idx > 0 && <span className="text-zinc-300 dark:text-zinc-700">/</span>}
              <div 
                className={`flex items-center gap-1.5 font-medium ${
                  step === s.num
                    ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                    : step > s.num
                    ? "text-zinc-500 dark:text-zinc-400"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  step === s.num
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : step > s.num
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}>
                  {step > s.num ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          Sign out
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto my-auto py-8">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: SELECT PLAN                                                      */}
          {/* ========================================================================= */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Left Column: Plan Options */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                    Select your workspace plan
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Choose the plan that fits your scheduling requirements. Upgrade or change anytime.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Personal (Free) */}
                  <div
                    onClick={() => setSelectedPlan("FREE")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === "FREE"
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Personal</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Free Forever
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Unlimited 1-on-1 meetings, customizable event links, and Google Calendar sync.
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        selectedPlan === "FREE"
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}>
                        {selectedPlan === "FREE" && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Pro */}
                  <div
                    onClick={() => setSelectedPlan("PRO")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === "PRO"
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Team Pro</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                              $12 / user / mo
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Collective scheduling, round-robin team assignment, automated workflows, and routing forms.
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        selectedPlan === "PRO"
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}>
                        {selectedPlan === "PRO" && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </div>
                    </div>
                  </div>

                  {/* Option 3: Enterprise */}
                  <div
                    onClick={() => setSelectedPlan("ENTERPRISE")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === "ENTERPRISE"
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Enterprise</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                              $28 / user / mo
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            SAML SSO, custom domain support, dedicated account manager, and SOC2 compliance export.
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        selectedPlan === "ENTERPRISE"
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}>
                        {selectedPlan === "ENTERPRISE" && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={handlePlanContinue}
                    disabled={loading}
                    className="h-9 px-5 text-xs font-semibold"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                    Next: Profile Setup <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Clean Zinc Summary Card */}
              <div className="md:col-span-5">
                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Selected Plan</span>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {selectedPlan === "FREE" ? "Personal Free" : selectedPlan === "PRO" ? "Team Pro" : "Enterprise"}
                      </h4>
                    </div>
                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedPlan === "FREE" ? "$0" : selectedPlan === "PRO" ? "$12" : "$28"}
                      <span className="text-[10px] font-normal text-zinc-400">/mo</span>
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{selectedPlan === "FREE" ? "1 Active Calendar Sync" : "Unlimited Calendar Connections"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{selectedPlan === "FREE" ? "Standard Meeting Durations" : "Round-Robin & Collective Slots"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Google Meet & Zoom links generated automatically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Webhooks & REST API access included</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" /> 100% Data Privacy
                    </span>
                    <span>No credit card required</span>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Left Column: Form */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                    Profile & Booking Link
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Customize your name, booking URL handle, and default timezone for attendees.
                  </p>
                </div>

                {/* Profile Picture */}
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-4">
                  <Avatar className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <AvatarImage src={image} className="object-cover" />
                    <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs">
                      {name ? name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition">
                      <Upload className="w-3 h-3 text-zinc-500" />
                      <span>Upload Avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-zinc-400 mt-1">Recommended: 256x256 square JPG or PNG</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Booking Link URL
                  </label>
                  <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600">
                    <span className="text-zinc-400 select-none font-mono">calmeet.com/</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      placeholder="yourname"
                      className="w-full bg-transparent text-xs outline-none text-zinc-900 dark:text-zinc-100 font-mono pl-1"
                    />
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                  >
                    {COMMON_TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Short Bio / Welcome Note
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short welcome description for your guests."
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 resize-none"
                  />
                </div>

                {/* Navigation */}
                <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStep(1);
                      router.push("/onboarding/getting-started");
                    }}
                    className="h-9 px-4 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                  </Button>
                  <Button
                    onClick={handleDetailsContinue}
                    disabled={loading}
                    size="sm"
                    className="h-9 px-5 text-xs font-semibold"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                    Next: Calendar Sync <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Live CalMeet Booking Preview */}
              <div className="md:col-span-5">
                <div className="sticky top-6 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Live Booking Preview</span>
                    <span className="text-[10px] font-mono text-zinc-400">/{username || "username"}</span>
                  </div>

                  {/* Host Profile Header */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <AvatarImage src={image} className="object-cover" />
                      <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs">
                        {name ? name.slice(0, 2).toUpperCase() : "CM"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {name || "Your Name"}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {bio || "Let's find time to connect."}
                      </div>
                    </div>
                  </div>

                  {/* Sample Event Cards */}
                  <div className="space-y-2 pt-1">
                    {[
                      { title: "15 Min Quick Chat", duration: "15m", icon: Clock },
                      { title: "30 Min Consultation", duration: "30m", icon: Video },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                            <item.icon className="w-3 h-3" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">{item.title}</span>
                            <span className="text-[10px] text-zinc-400">{item.duration} • Google Meet</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          Select
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[10px] text-zinc-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>Timezone: {timezone}</span>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Left Column: Integrations List */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                    Connect Calendars & Video Rooms
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Automatically sync events to prevent conflicts and generate Google Meet or Zoom links for bookings.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Google Calendar */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Google Calendar</span>
                          {connectedCalendars.google && (
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Synced
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Read availability & create Google Meet links</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={connectedCalendars.google ? "secondary" : "outline"}
                      onClick={() => handleConnectCalendar("google")}
                      className="h-8 px-3 text-xs"
                    >
                      {connectedCalendars.google ? "Connected" : "Connect"}
                    </Button>
                  </div>

                  {/* Zoom */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Zoom Meetings</span>
                          {connectedCalendars.zoom && (
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Generate Zoom video links for booked slots</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={connectedCalendars.zoom ? "secondary" : "outline"}
                      onClick={() => handleConnectCalendar("zoom")}
                      className="h-8 px-3 text-xs"
                    >
                      {connectedCalendars.zoom ? "Connected" : "Connect"}
                    </Button>
                  </div>

                  {/* Microsoft 365 / Outlook */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 font-bold text-xs">
                        365
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Outlook / Office 365</span>
                          {connectedCalendars.outlook && (
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Sync with Microsoft calendar and Teams rooms</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={connectedCalendars.outlook ? "secondary" : "outline"}
                      onClick={() => handleConnectCalendar("outlook")}
                      className="h-8 px-3 text-xs"
                    >
                      {connectedCalendars.outlook ? "Connected" : "Connect"}
                    </Button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStep(2);
                      router.push("/onboarding/personal/settings");
                    }}
                    className="h-9 px-4 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleComplete}
                      disabled={loading}
                      className="h-9 px-3 text-xs text-zinc-500"
                    >
                      Skip
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={loading}
                      size="sm"
                      className="h-9 px-5 text-xs font-semibold"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                      Finish Setup <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Working Hours Snapshot */}
              <div className="md:col-span-5">
                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Default Working Hours</span>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Monday – Friday
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      9:00 AM – 5:00 PM
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { day: "Mon – Fri", time: "9:00 AM – 5:00 PM", status: "Available" },
                      { day: "Sat – Sun", time: "Unavailable", status: "Blocked" },
                    ].map((slot, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{slot.day}</span>
                        <span className="text-[10px] text-zinc-400">{slot.time}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          slot.status === "Available"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                        }`}>
                          {slot.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-zinc-400 pt-1 leading-relaxed">
                    You can add custom date overrides, lunch buffers, and holiday blocking in your dashboard settings anytime.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400">
        <Link href="/terms" className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          Terms & Privacy
        </Link>
        <span>CalMeet Scheduling Platform</span>
      </footer>
    </div>
  );
}
