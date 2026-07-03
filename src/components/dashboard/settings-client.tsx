"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateProfile, updateAvatar, uploadAvatarToCloudinary } from "@/app/actions/settings";
import { Loader2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/crop-image";

import { usePricingModal } from "@/components/dashboard/pricing-modal";

export function SettingsForm({ user }: { user: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
  });

  const { openPricingModal } = usePricingModal();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setIsCropOpen(true);
    });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    setIsCropOpen(false);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) {
        throw new Error("Failed to crop image");
      }

      const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      const uploadData = new FormData();
      uploadData.append("file", croppedFile);

      const result = await uploadAvatarToCloudinary(uploadData);
      
      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.url) {
        setAvatarUrl(result.url);
        toast.success("Avatar updated successfully!");
      }
    } catch (error: any) {
      console.error("Avatar upload failed:", error.message || error);
      toast.error("Failed to upload avatar to Cloudinary.");
    } finally {
      setIsUploading(false);
      setImageSrc(null);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How others see you on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-background shadow-md">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xl">{formData.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
                disabled={isUploading}
              />
              <Button 
                variant="outline" 
                type="button"
                onClick={() => document.getElementById("avatar-upload")?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Change Avatar"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size of 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center">
                <span className="px-3 py-2 border border-r-0 rounded-l-md bg-muted text-muted-foreground text-sm">calmeet.app/</span>
                <Input 
                  id="username" 
                  value={formData.username} 
                  className="rounded-l-none" 
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea 
              id="bio"
              rows={3}
              className="w-full px-4 py-3 rounded-md border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing & Subscription</CardTitle>
          <CardDescription>View your current subscription plan and manage your billing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Current Plan</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black uppercase tracking-wide text-zinc-900 dark:text-white">
                  {user.plan || "FREE"}
                </span>
                {user.plan === "PRO" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-zinc-500/10 text-zinc-500 font-bold px-2.5 py-0.5 rounded-full border border-zinc-500/20">
                    Free Tier
                  </span>
                )}
              </div>
            </div>

            <Button 
              onClick={openPricingModal} 
              variant={user.plan === "PRO" ? "outline" : "default"}
              className="h-10 px-5 text-xs font-bold"
            >
              {user.plan === "PRO" ? "Manage Plan Options" : "Upgrade to Pro"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>New Bookings</Label>
              <p className="text-sm text-muted-foreground">Receive an email when someone books a meeting.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <div className="space-y-0.5">
              <Label>Cancellations</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a meeting is cancelled.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Actions that cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crop Profile Image</DialogTitle>
            <DialogDescription>
              Drag to position and use the slider to zoom.
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[320px] bg-zinc-900 rounded-xl overflow-hidden mt-4">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setIsCropOpen(false); setImageSrc(null); }}>
              Cancel
            </Button>
            <Button onClick={handleCropSave} disabled={isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crop & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

