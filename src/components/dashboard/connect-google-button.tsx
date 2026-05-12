"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function ConnectGoogleButton() {
  return (
    <Button 
      onClick={() => signIn("google", { callbackUrl: "/dashboard/integrations" })}
    >
      Connect Account
    </Button>
  );
}
