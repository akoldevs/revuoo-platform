// src/components/dashboard/IntegrationManageModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ 1. Import the router
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  saveIntegrationSettings,
  disconnectBusinessIntegration,
} from "@/app/dashboard/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, Trash2 } from "lucide-react";

type Props = {
  businessIntegrationId: number;
  integrationName: string;
  currentSettings: { webhook_url?: string } | null;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Settings"}
    </Button>
  );
}

export function IntegrationManageModal({
  businessIntegrationId,
  integrationName,
  currentSettings,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // ✅ 2. Initialize the router

  async function handleSave(formData: FormData) {
    const result = await saveIntegrationSettings(formData);
    if (result.error) {
      toast.error(`Failed to save settings`, { description: result.error });
    } else {
      toast.success(result.message);
      setIsOpen(false);
    }
  }

  async function handleDisconnect(formData: FormData) {
    const result = await disconnectBusinessIntegration(formData);
    if (result.error) {
      toast.error(`Failed to disconnect`, { description: result.error });
    } else {
      toast.success(result.message);
      // ✅ 3. FIX: Refresh the current page instead of redirecting
      router.refresh();
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <CheckCircle className="mr-2 h-4 w-4" />
        Manage
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {integrationName} Integration</DialogTitle>
          <DialogDescription>
            Update your connection settings below. For Zapier, you can find your
            webhook URL inside your Zap.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSave} className="space-y-4">
          <input
            type="hidden"
            name="business_integration_id"
            value={businessIntegrationId}
          />

          <div className="space-y-2">
            <Label htmlFor="webhook_url">Zapier Webhook URL</Label>
            <Input
              name="webhook_url"
              id="webhook_url"
              defaultValue={currentSettings?.webhook_url || ""}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <SaveButton />
          </DialogFooter>
        </form>

        <div className="mt-6 pt-6 border-t border-destructive/20">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Disconnect {integrationName}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently disconnect this integration and delete
                  any associated settings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={handleDisconnect}>
                  <input
                    type="hidden"
                    name="business_integration_id"
                    value={businessIntegrationId}
                  />
                  <AlertDialogAction type="submit">Continue</AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
