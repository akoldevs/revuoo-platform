// src/components/contributor/StripeConnectButton.tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createStripeConnectLink } from "@/app/actions/contributorActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function StripeConnectButton() {
  const [isPending, startTransition] = useTransition();

  const handleConnect = () => {
    startTransition(async () => {
      const result = await createStripeConnectLink();
      if (result.error) {
        toast.error("Connection Failed", { description: result.error });
      } else if (result.url) {
        window.location.href = result.url;
      }
    });
  };

  return (
    <Button onClick={handleConnect} disabled={isPending}>
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Connect with Stripe
    </Button>
  );
}
