// src/components/dashboard/IntegrationConnectModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { connectBusinessIntegration } from "@/app/dashboard/actions";

type Props = {
  integrationId: string;
  integrationName: string;
  businessId: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Connecting..." : "Confirm & Connect"}
    </Button>
  );
}

export function IntegrationConnectModal({
  integrationId,
  integrationName,
  businessId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await connectBusinessIntegration(formData);
    if (result.error) {
      toast.error(`Failed to connect ${integrationName}`, {
        description: result.error,
      });
    } else {
      toast.success(result.message);
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Connect
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to {integrationName}</DialogTitle>
          <DialogDescription>
            You are about to connect your Revuoo business account to{" "}
            {integrationName}. (In a real app, this is where you would add
            instructions or an API key input field).
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <input type="hidden" name="integration_id" value={integrationId} />
          <input type="hidden" name="business_id" value={businessId} />
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
