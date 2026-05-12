"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/settings";
import { Loader2 } from "lucide-react";

export function SettingsForm({ user }: { user: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
  });

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
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Avatar</Button>
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
                <span className="px-3 py-2 border border-r-0 rounded-l-md bg-muted text-muted-foreground text-sm">meetme.app/</span>
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
    </div>
  );
}
