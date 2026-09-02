"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Settings as SettingsIcon, 
  Calendar, 
  Video, 
  Palette, 
  CalendarOff, 
  Bell, 
  Gift, 
  KeyRound, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Code2, 
  Key, 
  Webhook, 
  Search, 
  Upload, 
  Loader2, 
  Check, 
  Copy,
  Globe, 
  Sun, 
  Moon, 
  Laptop, 
  Lock,
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  AlertTriangle,
  RefreshCw,
  QrCode,
  Shield,
  ShieldAlert,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { updateProfile, uploadAvatarToCloudinary, updateBrandingSettings } from "@/app/actions/settings";
import { 
  createWebhook, 
  deleteWebhook, 
  toggleWebhook, 
  createApiKey, 
  deleteApiKey 
} from "@/app/actions/developers";
import { setUserPlan, PlanType } from "@/app/actions/plan";
import { usePricingModal } from "@/components/dashboard/pricing-modal";
import { useTheme } from "next-themes";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SettingsClientProps {
  user: any;
  initialWebhooks?: any[];
  initialApiKeys?: any[];
}

export function SettingsForm({ user, initialWebhooks = [], initialApiKeys = [] }: SettingsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";

  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingBranding, setIsUpdatingBranding] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || user.email?.split("@")[0] || "user",
    bio: user.bio || "",
    timezone: user.timezone || "Asia/Kolkata",
    weekStart: "Monday",
    timeFormat: "12h",
    dateFormat: "DD/MM/YYYY",
    language: "en",
    defaultConferencing: "GOOGLE_MEET",
    brandColor: "#18181b",
    hideBranding: user.hideWatermark ?? false,
    outOfOfficeEnabled: false,
    outOfOfficeStart: "",
    outOfOfficeEnd: "",
    outOfOfficeRedirect: "",
    notifyBookings: true,
    notifyCancellations: true,
    notifyReschedules: true,
    notifyDailyDigest: false,
    twoFactorEnabled: false,
  });


  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirmPass: "" });
  const [showPass, setShowPass] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Real Webhooks state
  const [webhooks, setWebhooks] = useState<any[]>(initialWebhooks);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [deletingWebhookId, setDeletingWebhookId] = useState<string | null>(null);

  // Real API Keys state
  const [apiKeys, setApiKeys] = useState<any[]>(initialApiKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  const { openPricingModal } = usePricingModal();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const result = await uploadAvatarToCloudinary(uploadData);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.url) {
        setAvatarUrl(result.url);
        toast.success("Avatar updated successfully!");
      }
    } catch (error: any) {
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) return;
    setIsAddingWebhook(true);
    try {
      const result = await createWebhook({ url: newWebhookUrl.trim() });
      if (result.error) {
        toast.error(result.error);
      } else if (result.webhook) {
        setWebhooks([result.webhook, ...webhooks]);
        setNewWebhookUrl("");
        toast.success("Webhook endpoint registered successfully!");
      }
    } catch (err: any) {
      toast.error("Failed to add webhook");
    } finally {
      setIsAddingWebhook(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    setDeletingWebhookId(id);
    try {
      const result = await deleteWebhook(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        setWebhooks(webhooks.filter((w) => w.id !== id));
        toast.success("Webhook endpoint removed.");
      }
    } catch (err: any) {
      toast.error("Failed to delete webhook");
    } finally {
      setDeletingWebhookId(null);
    }
  };

  const handleToggleWebhook = async (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    setWebhooks(webhooks.map((w) => (w.id === id ? { ...w, active: newActive } : w)));
    try {
      const result = await toggleWebhook(id, newActive);
      if (result.error) {
        toast.error(result.error);
        setWebhooks(webhooks.map((w) => (w.id === id ? { ...w, active: currentActive } : w)));
      } else {
        toast.success(newActive ? "Webhook activated" : "Webhook paused");
      }
    } catch {
      setWebhooks(webhooks.map((w) => (w.id === id ? { ...w, active: currentActive } : w)));
      toast.error("Failed to update webhook");
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingKey(true);
    try {
      const result = await createApiKey(newKeyName);
      if (result.error) {
        toast.error(result.error);
      } else if (result.apiKey) {
        setApiKeys([result.apiKey, ...apiKeys]);
        setNewKeyName("");
        toast.success(`API Key generated successfully!`);
      }
    } catch (err: any) {
      toast.error("Failed to generate API Key");
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    setDeletingKeyId(id);
    try {
      const result = await deleteApiKey(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        setApiKeys(apiKeys.filter((k) => k.id !== id));
        toast.success("API Key revoked.");
      }
    } catch (err: any) {
      toast.error("Failed to revoke API Key");
    } finally {
      setDeletingKeyId(null);
    }
  };

  // Sections config for Overview grid
  const personalSettingsCards = [
    { id: "profile", title: "Profile", description: "Manage your profile details, avatar, and username", icon: User },
    { id: "general", title: "General", description: "Manage language, timezone, and calendar preferences", icon: SettingsIcon },
    { id: "calendars", title: "Calendars", description: "Connect and manage your Google Calendar integrations", icon: Calendar },
    { id: "conferencing", title: "Conferencing", description: "Configure default video apps (Google Meet, Zoom)", icon: Video },
    { id: "out-of-office", title: "Out of office", description: "Set your away dates and redirect bookings", icon: CalendarOff },
    { id: "billing", title: "Manage billing", description: "View and manage your subscription and invoices", icon: CreditCard },
    { id: "plans", title: "Plans", description: "Compare plans and upgrade your subscription", icon: Sparkles },
    { id: "appearance", title: "Appearance", description: "Customize your booking page theme and branding", icon: Palette },
    { id: "notifications", title: "Push notifications", description: "Configure email notifications and booking reminders", icon: Bell },
    { id: "refer-and-earn", title: "Refer and earn", description: "Earn rewards by referring others to CalMeet", icon: Gift },
  ];

  const securitySettingsCards = [
    { id: "password", title: "Password", description: "Update your password or sign-in method", icon: KeyRound },
    { id: "2fa", title: "Two factor authentication", description: "Add an extra layer of security to your account", icon: Lock },
    { id: "compliance", title: "Compliance", description: "Manage data compliance and export your data", icon: ShieldCheck },
  ];

  const developerSettingsCards = [
    { id: "webhooks", title: "Webhooks", description: "Send HTTP webhooks on scheduled or canceled bookings", icon: Webhook },
    { id: "api-keys", title: "API keys", description: "Manage personal access tokens for developers", icon: Key },
  ];

  const filterCards = (cards: typeof personalSettingsCards) => {
    if (!searchQuery) return cards;
    const q = searchQuery.toLowerCase();
    return cards.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      {/* 1. OVERVIEW VIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Settings
            </h1>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="search"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>

          {/* Personal Settings Group */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
              Personal settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filterCards(personalSettingsCards).map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      router.push(`/dashboard/settings?tab=${card.id}`);
                    }}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left flex flex-col justify-between group shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {card.title}
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Group */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
              Security
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filterCards(securitySettingsCards as any).map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => router.push(`/dashboard/settings?tab=${card.id}`)}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left flex flex-col justify-between group shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {card.title}
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Developer Group */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
              Developer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filterCards(developerSettingsCards as any).map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => router.push(`/dashboard/settings?tab=${card.id}`)}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left flex flex-col justify-between group shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {card.title}
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. PROFILE */}
      {activeTab === "profile" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Profile</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage your public avatar, name, and booking handle.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="flex items-center gap-5 pt-2">
            <div className="relative">
              <Avatar className="h-16 w-16 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-base font-bold">
                  {formData.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <input
                type="file"
                id="avatar-upload-file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
                disabled={isUploading}
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => document.getElementById("avatar-upload-file")?.click()}
                disabled={isUploading}
                className="h-8 text-xs gap-1.5 rounded-lg border-zinc-200 dark:border-zinc-800"
              >
                <Upload className="h-3.5 w-3.5" />
                {isUploading ? "Uploading..." : "Upload photo"}
              </Button>
              <p className="text-[11px] text-zinc-400">JPG or PNG. Max size of 5MB.</p>
            </div>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username-handle">Username</Label>
                <div className="flex items-center">
                  <span className="h-9 px-2.5 flex items-center border border-r-0 rounded-l-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-400 text-xs">
                    calmeet.app/
                  </span>
                  <Input
                    id="username-handle"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="h-9 text-xs rounded-l-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-bio">Bio</Label>
              <textarea
                id="profile-bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Short bio about yourself..."
                className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={isSubmitting}
              size="sm"
              className="h-9 px-4 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* 3. GENERAL */}
      {activeTab === "general" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">General Preferences</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Configure your timezone, language, and calendar display options.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs"
              >
                <option value="Asia/Kolkata">India Standard Time (Asia/Kolkata)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">Eastern Time (America/New_York)</option>
                <option value="America/Chicago">Central Time (America/Chicago)</option>
                <option value="America/Los_Angeles">Pacific Time (America/Los_Angeles)</option>
                <option value="Europe/London">London (Europe/London)</option>
                <option value="Europe/Berlin">Berlin / Paris (Europe/Berlin)</option>
                <option value="Asia/Tokyo">Tokyo (Asia/Tokyo)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>First Day of Week</Label>
                <select
                  value={formData.weekStart}
                  onChange={(e) => setFormData({ ...formData, weekStart: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs"
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Time Format</Label>
                <select
                  value={formData.timeFormat}
                  onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs"
                >
                  <option value="12h">12-hour (9:00 am)</option>
                  <option value="24h">24-hour (09:00)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Language</Label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="ja">日本語 (Japanese)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Organization Subdomain Section */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Company Subdomain</Label>
                    {user.plan !== "ORGANIZATION" && user.plan !== "ENTERPRISE" && (
                      <span className="text-[10px] font-bold text-violet-600 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                        Organization Tier
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">Provide all team members with dedicated links under your corporate subdomain.</p>
                </div>
                {user.plan !== "ORGANIZATION" && user.plan !== "ENTERPRISE" && (
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    onClick={() => openPricingModal()}
                    className="h-7 text-[11px] border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
                  >
                    Unlock
                  </Button>
                )}
              </div>

              {user.plan === "ORGANIZATION" || user.plan === "ENTERPRISE" ? (
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="yourcompany" 
                    defaultValue={user.username || "acme"} 
                    className="h-9 text-xs max-w-xs font-mono" 
                  />
                  <span className="text-xs font-semibold text-zinc-500">.calmeet.com</span>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={() => toast.success("Company subdomain updated successfully!")}
                    className="h-9 text-xs"
                  >
                    Save Subdomain
                  </Button>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 bg-background/50 flex items-center justify-between">
                  <span>Preview: <strong className="text-zinc-600 dark:text-zinc-300 font-mono">https://company.calmeet.com</strong></span>
                  <span className="text-zinc-400">Available on Organizations & Enterprise</span>
                </div>
              )}
            </div>
          </div>


          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <Button
              onClick={() => toast.success("General preferences updated!")}
              size="sm"
              className="h-9 px-4 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              Save Preferences
            </Button>
          </div>
        </div>
      )}

      {/* 4. CALENDARS */}
      {activeTab === "calendars" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Calendar Integrations</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Set the calendars to check for conflicts to prevent double bookings.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
              <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Add to calendar</Label>
              <p className="text-[11px] text-zinc-500">Select where to add events when you're booked.</p>
              <select className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs">
                <option>{user.email} (Google Calendar)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Check for conflicts</h3>
                  <p className="text-[11px] text-zinc-500">Select which calendars you want to check for conflicts.</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => router.push("/dashboard/integrations")}
                  className="h-7 text-xs gap-1 border-zinc-200 dark:border-zinc-800 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                    📅
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Google Calendar</span>
                    <span className="text-[11px] text-zinc-400">{user.email}</span>
                  </div>
                </div>
                <Switch defaultChecked className="scale-90" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONFERENCING */}
      {activeTab === "conferencing" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Conferencing Apps</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose your default video meeting provider for scheduled calls.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { id: "GOOGLE_MEET", name: "Google Meet", desc: "Built-in with Google Workspace & Gmail accounts", connected: true },
              { id: "ZOOM", name: "Zoom Video", desc: "Connect your Zoom personal meeting room or dynamic links", connected: false },
              { id: "CAL_VIDEO", name: "Cal Video", desc: "CalMeet native in-browser WebRTC video room", connected: true },
            ].map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold">
                    <Video className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{app.name}</h3>
                    <p className="text-[11px] text-zinc-400">{app.desc}</p>
                  </div>
                </div>
                {app.connected ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    Connected
                  </span>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => router.push("/dashboard/integrations")}
                    className="h-7 text-xs border-zinc-200 dark:border-zinc-800 cursor-pointer"
                  >
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. APPEARANCE */}
      {activeTab === "appearance" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Appearance & Theme</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Customize your dashboard theme and public booking page styling.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-semibold">Theme Mode</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { mode: "light", label: "Light", icon: Sun },
                  { mode: "dark", label: "Dark", icon: Moon },
                  { mode: "system", label: "System", icon: Laptop },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = mounted ? (theme === t.mode || (!theme && t.mode === "system")) : t.mode === "system";
                  return (
                    <button
                      key={t.mode}
                      onClick={() => {
                        setTheme(t.mode);
                        toast.success(`Theme set to ${t.label} mode`);
                      }}
                      className={cn(
                        "p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer",
                        isSelected
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>


            {/* White-labeling / Watermark removal section */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                      Remove CalMeet Watermark
                    </span>
                    {user.plan === "FREE" && (
                      <span className="text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase">
                        Teams & Above
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Hide the &apos;Powered by CalMeet&apos; footer badge on your public booking page and confirmation emails.
                  </p>
                </div>

                <Switch
                  checked={formData.hideBranding}
                  disabled={isUpdatingBranding}
                  onCheckedChange={async (checked) => {
                    if (user.plan === "FREE" && checked) {
                      toast.error("Removing the CalMeet watermark requires a Teams, Organizations, or Enterprise plan.");
                      openPricingModal();
                      return;
                    }

                    setIsUpdatingBranding(true);
                    try {
                      const res = await updateBrandingSettings({ hideWatermark: checked });
                      if (res?.error) {
                        toast.error(res.error);
                      } else {
                        setFormData({ ...formData, hideBranding: checked });
                        toast.success(checked ? "Watermark disabled on your public booking pages!" : "Watermark enabled.");
                      }
                    } catch (e: any) {
                      toast.error("Failed to update branding settings.");
                    } finally {
                      setIsUpdatingBranding(false);
                    }
                  }}
                  className="scale-90"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. OUT OF OFFICE */}
      {activeTab === "out-of-office" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Out of Office Redirect</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Set dates when you're away and forward booking requests to a colleague.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Enable Out of Office</span>
                <span className="text-[11px] text-zinc-400">Automatically pause bookings or redirect to a teammate</span>
              </div>
              <Switch
                checked={formData.outOfOfficeEnabled}
                onCheckedChange={(c) => setFormData({ ...formData, outOfOfficeEnabled: c })}
                className="scale-90"
              />
            </div>

            {formData.outOfOfficeEnabled && (
              <div className="space-y-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Start Date</Label>
                    <Input type="date" className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label>End Date</Label>
                    <Input type="date" className="h-9 text-xs" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Redirect to Teammate Email</Label>
                  <Input type="email" placeholder="colleague@company.com" className="h-9 text-xs" />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <Button
              onClick={() => toast.success("Out of office settings saved!")}
              size="sm"
              className="h-9 px-4 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              Save Out of Office
            </Button>
          </div>
        </div>
      )}

      {/* 8. PUSH NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Push Notifications & Alerts</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose what event updates and reminders you receive.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">New Bookings</span>
                <span className="text-[11px] text-zinc-400">Receive an email when someone books a new meeting</span>
              </div>
              <Switch defaultChecked className="scale-90" />
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Cancellations</span>
                <span className="text-[11px] text-zinc-400">Receive an email when an attendee cancels a meeting</span>
              </div>
              <Switch defaultChecked className="scale-90" />
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Reschedules</span>
                <span className="text-[11px] text-zinc-400">Receive an email when a meeting is moved to a new time</span>
              </div>
              <Switch defaultChecked className="scale-90" />
            </div>
          </div>
        </div>
      )}

      {/* 9. REFER AND EARN */}
      {activeTab === "refer-and-earn" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Refer & Earn</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Share your referral link with friends and colleagues to earn credits.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
            <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Your Referral Link</Label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`https://calmeet.app/signup?ref=${formData.username}`}
                className="h-9 text-xs font-mono bg-background"
              />
              <Button
                size="sm"
                onClick={() => copyToClipboard(`https://calmeet.app/signup?ref=${formData.username}`, "ref")}
                className="h-9 px-3.5 text-xs shrink-0"
              >
                {copiedKey === "ref" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 10. PASSWORD */}
      {activeTab === "password" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Security & Password</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Change your password to keep your account secure.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="space-y-3 text-xs max-w-md">
            <div className="space-y-1">
              <Label>Current Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <Button
              onClick={() => {
                if (!passwords.newPass || passwords.newPass !== passwords.confirmPass) {
                  toast.error("Passwords do not match");
                  return;
                }
                toast.success("Password changed successfully!");
                setPasswords({ current: "", newPass: "", confirmPass: "" });
              }}
              size="sm"
              className="h-9 px-4 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              Update Password
            </Button>
          </div>
        </div>
      )}

      {/* 11. TWO FACTOR AUTH */}
      {activeTab === "2fa" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Two-Factor Authentication</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Add an extra layer of security using an authenticator app (Google Authenticator / 1Password).
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Authenticator App 2FA</span>
                  <span className="text-[11px] text-zinc-400">Require TOTP verification code on each login</span>
                </div>
              </div>
              <Switch
                checked={formData.twoFactorEnabled}
                onCheckedChange={(c) => {
                  setFormData({ ...formData, twoFactorEnabled: c });
                  toast.success(c ? "Two-Factor Auth Enabled" : "Two-Factor Auth Disabled");
                }}
                className="scale-90"
              />
            </div>

            {/* SAML SSO Section */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100">SAML SSO & SCIM Sync</Label>
                    {user.plan !== "ORGANIZATION" && user.plan !== "ENTERPRISE" && (
                      <span className="text-[10px] font-bold text-violet-600 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                        Organization Tier
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">Allow employees to sign in using Okta, Azure AD, or Google Workspace SSO.</p>
                </div>
                {user.plan !== "ORGANIZATION" && user.plan !== "ENTERPRISE" ? (
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    onClick={() => openPricingModal()}
                    className="h-7 text-[11px] border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
                  >
                    Unlock
                  </Button>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Configured
                  </span>
                )}
              </div>

              {user.plan === "ORGANIZATION" || user.plan === "ENTERPRISE" ? (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-card rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold block text-zinc-900 dark:text-zinc-100">Corporate IdP URL</span>
                      <span className="text-[11px] font-mono text-zinc-500">https://sso.yourcompany.com/calmeet/saml</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("SAML metadata refreshed")}>
                      Refresh
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 bg-background/50 flex items-center justify-between">
                  <span>Enforce single sign-on across all corporate user accounts</span>
                  <span className="text-zinc-400">Available on Organizations & Enterprise</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* 12. COMPLIANCE */}
      {activeTab === "compliance" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Data Compliance & Privacy</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage your data privacy, exports, and GDPR options.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Export Personal Data</span>
                <span className="text-[11px] text-zinc-400">Download a complete JSON export of all your bookings, event types, and profile info</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
                  const dlAnchor = document.createElement("a");
                  dlAnchor.setAttribute("href", dataStr);
                  dlAnchor.setAttribute("download", `calmeet-data-${formData.username}.json`);
                  dlAnchor.click();
                  toast.success("Data export downloaded!");
                }}
                className="h-8 text-xs gap-1 border-zinc-200 dark:border-zinc-800"
              >
                <Download className="h-3.5 w-3.5" /> Export Data
              </Button>
            </div>

            {/* Enterprise Security Pack */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Enterprise Security & Compliance Pack</span>
                    {user.plan !== "ENTERPRISE" && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Enterprise Tier
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400">SOC2 Type II report, HIPAA Business Associate Agreement (BAA), and tamper-proof audit trails.</span>
                </div>
                {user.plan !== "ENTERPRISE" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPricingModal()}
                    className="h-7 text-[11px] border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                  >
                    Unlock
                  </Button>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Active & Compliant
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-card border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-300">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> SOC2 Type II
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-card border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-300">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> HIPAA BAA
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-card border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-300">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> GDPR & DPA
                </span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 13. PLANS TAB */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Subscription Plans</h2>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full uppercase">
                    Active: {user.plan || "FREE"}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Compare plans, upgrade to team collaboration, and manage your scheduling features.
                </p>
              </div>
              <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back to Overview
              </Link>
            </div>

            {/* Sandbox Plan Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>
                  <strong>Sandbox Simulator:</strong> Switch your tier instantly to test feature gating across the entire application.
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["FREE", "PRO", "ORGANIZATION", "ENTERPRISE"] as PlanType[]).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={user.plan === p ? "default" : "outline"}
                    onClick={async () => {
                      try {
                        const res = await setUserPlan(p);
                        if (res.success) {
                          toast.success(`Active tier switched to ${p}!`);
                          window.location.reload();
                        }
                      } catch (e: any) {
                        toast.error(e.message || "Failed to switch plan");
                      }
                    }}
                    disabled={user.plan === p}
                    className={cn(
                      "h-7 text-[10px] px-2.5 font-bold uppercase",
                      user.plan === p && "bg-amber-600 hover:bg-amber-700 text-white border-transparent"
                    )}
                  >
                    {p === "PRO" ? "Teams" : p === "ORGANIZATION" ? "Org" : p}
                  </Button>
                ))}
              </div>
            </div>

            {/* 4 Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                {
                  id: "FREE",
                  name: "Individuals",
                  price: "$0",
                  suffix: "/ mo",
                  desc: "Essential 1-on-1 scheduling.",
                  features: ["Unlimited Bookings", "Calendar Sync", "Video Conferencing", "Standard Watermark"],
                  popular: false
                },
                {
                  id: "PRO",
                  name: "Teams",
                  price: "$12",
                  suffix: "/ user / mo",
                  desc: "Team routing, reminders & white-label.",
                  features: ["Round-Robin & Collective", "Remove Watermark", "Automated Workflows", "Routing Forms", "Advanced Analytics", "Webhooks & API Keys"],
                  popular: true
                },
                {
                  id: "ORGANIZATION",
                  name: "Organizations",
                  price: "$28",
                  suffix: "/ user / mo",
                  desc: "Multi-department & custom subdomain.",
                  features: ["Unlimited Sub-teams", "Company Subdomain", "SAML SSO / SCIM", "RBAC & Team Policies", "24/7 Priority SLA"],
                  popular: false
                },
                {
                  id: "ENTERPRISE",
                  name: "Enterprise",
                  price: "Custom",
                  suffix: "quote",
                  desc: "Custom security, SLA & compliance.",
                  features: ["Dedicated CSM & Engineer", "99.99% Uptime SLA", "SOC2 & HIPAA BAA", "Slack Connect Channel"],
                  popular: false
                }
              ].map((p) => {
                const isCurrent = (user.plan || "FREE") === p.id;
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "rounded-2xl border p-4 flex flex-col justify-between relative transition-all",
                      p.popular ? "border-primary/80 bg-primary/[0.02] shadow-sm" : "border-zinc-200 dark:border-zinc-800 bg-card",
                      isCurrent && "ring-2 ring-emerald-500/50 border-emerald-500/40"
                    )}
                  >
                    {p.popular && (
                      <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase">
                        Popular
                      </span>
                    )}
                    {isCurrent && (
                      <span className="absolute top-0 left-0 bg-emerald-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-br-lg uppercase">
                        Current
                      </span>
                    )}

                    <div className="pt-2">
                      <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{p.name}</h3>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">{p.price}</span>
                        <span className="text-[10px] text-zinc-400 ml-1">{p.suffix}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1 min-h-[26px]">{p.desc}</p>
                      
                      <div className="w-full h-px bg-zinc-200 dark:border-zinc-800 my-3" />
                      
                      <ul className="space-y-1.5 text-[10px]">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-zinc-600 dark:text-zinc-350">
                            <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      size="sm"
                      variant={isCurrent ? "outline" : p.popular ? "default" : "outline"}
                      disabled={isCurrent}
                      onClick={async () => {
                        try {
                          const res = await setUserPlan(p.id as PlanType);
                          if (res.success) {
                            toast.success(`Successfully switched to ${p.name} plan!`);
                            window.location.reload();
                          }
                        } catch (e: any) {
                          toast.error("Failed to switch plan");
                        }
                      }}
                      className={cn(
                        "w-full mt-4 h-8 text-[11px] font-bold rounded-xl",
                        isCurrent && "border-emerald-500/40 text-emerald-600 pointer-events-none"
                      )}
                    >
                      {isCurrent ? "Active Plan" : `Switch to ${p.name}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resource Usage & Quotas */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Plan Quotas & Resource Usage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Event Types</span>
                <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">Unlimited</div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/4 rounded-full" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Team Seats</span>
                <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                  {user.plan === "FREE" ? "1 Seat (Solo)" : "Unlimited Seats"}
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/3 rounded-full" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Automated Workflows</span>
                <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                  {user.plan === "FREE" ? "Locked (Pro)" : "Active (Unlimited)"}
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/2 rounded-full" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Webhooks & API</span>
                <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                  {user.plan === "FREE" ? "Locked (Pro)" : "Enabled"}
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 w-2/3 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. BILLING TAB */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Manage Billing & Invoices</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  View your current billing status, payment methods, and invoice receipts.
                </p>
              </div>
              <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back to Overview
              </Link>
            </div>

            {/* Active Subscription Summary Card */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-400">Current Plan:</span>
                  <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                    {user.plan || "FREE"} Plan
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Next renewal: <strong className="text-zinc-700 dark:text-zinc-300">October 1, 2026</strong> • Auto-renew enabled
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push("/dashboard/settings?tab=plans")}
                  size="sm"
                  variant="outline"
                  className="h-9 px-3.5 text-xs font-semibold"
                >
                  Change Plan
                </Button>
                <Button
                  onClick={openPricingModal}
                  size="sm"
                  className="h-9 px-4 text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                >
                  Upgrade Tier
                </Button>
              </div>
            </div>

            {/* Payment Method Simulator */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px]">
                  VISA
                </div>
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Visa ending in 4242</span>
                  <span className="text-[11px] text-zinc-400">Expires 12/28 • Default payment method</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.info("Payment method updater simulator")}
                className="text-xs text-primary hover:underline"
              >
                Update Card
              </Button>
            </div>

            {/* Invoices Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Billing History</h3>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                {[
                  { id: "INV-2026-0901", date: "Sep 1, 2026", amount: user.plan === "FREE" ? "$0.00" : "$12.00", status: "Paid" },
                  { id: "INV-2026-0801", date: "Aug 1, 2026", amount: user.plan === "FREE" ? "$0.00" : "$12.00", status: "Paid" },
                  { id: "INV-2026-0701", date: "Jul 1, 2026", amount: user.plan === "FREE" ? "$0.00" : "$12.00", status: "Paid" },
                ].map((inv) => (
                  <div key={inv.id} className="p-3.5 flex items-center justify-between bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 block">{inv.id}</span>
                      <span className="text-[11px] text-zinc-400">{inv.date} • {inv.amount}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {inv.status}
                      </span>
                      <button
                        onClick={() => toast.success(`Receipt for ${inv.id} downloaded!`)}
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-1"
                        title="Download Receipt"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. WEBHOOKS */}
      {activeTab === "webhooks" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Developer Webhooks</h2>
                {user.plan === "FREE" && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    Pro & Teams Plan
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Send real-time HTTP POST notifications to your endpoints when meetings are booked or canceled.
              </p>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Overview
            </Link>
          </div>

          {user.plan === "FREE" ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Webhook className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Webhooks require a Pro or Teams Plan</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                  Trigger automated workflows in your CRM, backend API, or server whenever a booking is created or canceled.
                </p>
              </div>
              <Button 
                onClick={() => openPricingModal()}
                className="h-10 px-5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Upgrade Plan
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleAddWebhook} className="flex gap-2">
                <Input
                  placeholder="https://api.yourdomain.com/webhooks"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="h-9 text-xs"
                  required
                  disabled={isAddingWebhook}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={isAddingWebhook}
                  className="h-9 px-3.5 text-xs gap-1.5 shrink-0 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                >
                  {isAddingWebhook ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  Add Webhook
                </Button>
              </form>

              {webhooks.length === 0 ? (
                <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-xs text-zinc-500 space-y-1">
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300">No Webhook Endpoints Configured</p>
                  <p>Add a URL above to start receiving live webhook payloads on booking events.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                  {webhooks.map((wh) => (
                    <div key={wh.id} className="p-3.5 flex items-center justify-between bg-card hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                      <div className="space-y-1.5 min-w-0 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "font-bold px-1.5 py-0.5 rounded text-[10px]",
                            wh.active 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                          )}>
                            POST {wh.active ? "• LIVE" : "• PAUSED"}
                          </span>
                          <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {wh.url}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap text-[11px] text-zinc-500">
                          <div className="flex items-center gap-1">
                            {wh.events?.map((ev: string) => (
                              <span key={ev} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60 px-2 py-0.5 rounded-md text-[10px] font-mono">
                                {ev}
                              </span>
                            ))}
                          </div>
                          {wh.secret && (
                            <span className="font-mono text-[10px] text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800">
                              Signing Secret: {wh.secret.slice(0, 10)}...
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleWebhook(wh.id, wh.active)}
                          className="px-2 py-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                        >
                          {wh.active ? "Pause" : "Resume"}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(wh.url, wh.id)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Copy Webhook URL"
                        >
                          {copiedKey === wh.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          disabled={deletingWebhookId === wh.id}
                          onClick={() => handleDeleteWebhook(wh.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Webhook"
                        >
                          {deletingWebhookId === wh.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 15. API KEYS */}
      {activeTab === "api-keys" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">API Access Tokens</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage personal API keys for custom scripts, SDKs, and REST API integrations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/resources/api-docs" 
                target="_blank"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                API Docs <ExternalLink className="h-3 w-3" />
              </Link>
              <Link href="/dashboard/settings" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back
              </Link>
            </div>
          </div>

          <form onSubmit={handleCreateApiKey} className="flex gap-2">
            <Input
              placeholder="Key Name (e.g. Zapier Integration, Mobile App)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="h-9 text-xs"
              disabled={isCreatingKey}
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={isCreatingKey}
              className="h-9 px-3.5 text-xs gap-1.5 shrink-0 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              {isCreatingKey ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Generate Key
            </Button>
          </form>

          {apiKeys.length === 0 ? (
            <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-xs text-zinc-500 space-y-1">
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">No API Keys Generated</p>
              <p>Generate a key above to access the CalMeet REST API programmatically.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden text-xs">
              {apiKeys.map((k) => (
                <div key={k.id} className="p-3.5 flex items-center justify-between bg-card hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{k.name}</span>
                      <span className="text-[10px] text-zinc-400">
                        • Created {new Date(k.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {k.key}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(k.key, k.id)}
                        className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                        title="Copy Key"
                      >
                        {copiedKey === k.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {k.lastUsed && (
                      <p className="text-[10px] text-zinc-400">
                        Last used: {new Date(k.lastUsed).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    disabled={deletingKeyId === k.id}
                    onClick={() => handleDeleteApiKey(k.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer disabled:opacity-50"
                    title="Revoke API Key"
                  >
                    {deletingKeyId === k.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
