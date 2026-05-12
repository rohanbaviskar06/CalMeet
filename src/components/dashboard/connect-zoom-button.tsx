"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function ConnectZoomButton() {
  return (
    <Button 
      variant="outline"
      onClick={() => signIn("zoom", { callbackUrl: "/dashboard/integrations" })}
    >
      Connect Zoom
    </Button>
  );
}
