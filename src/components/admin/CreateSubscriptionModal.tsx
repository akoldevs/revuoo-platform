"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormStatus } from "react-dom";
// ✅ UPDATED: Import the new upsertSubscription function
import { upsertSubscription } from "@/app/admin/actions";
import { toast } from "sonner";
import { useRef } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="default" disabled={pending}>
      {pending ? "Saving Subscription..." : "Save Subscription"}
    </Button>
  );
}

export function CreateSubscriptionModal({
  isOpen,
  onClose,
  businessId,
  businessName,
}: {
  isOpen: boolean;
  onClose: () => void;
  businessId: number | null;
  businessName: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const formAction = async (formData: FormData) => {
    // ✅ UPDATED: Call the new upsertSubscription function
    const result = await upsertSubscription(formData);
    if (result?.error) {
      toast.error("Failed to save subscription", {
        description: result.error,
      });
    } else {
      toast.success("Subscription Saved!", {
        description: result.message,
      });
      formRef.current?.reset();
      onClose();
    }
  };

  if (!isOpen || !businessId || !businessName) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Subscription</DialogTitle>
          <DialogDescription>
            Upgrade, downgrade, or create a new subscription for{" "}
            <span className="font-bold">{businessName}</span>.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef}>
          <input type="hidden" name="businessId" value={businessId} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="planName" className="text-right">
                Plan
              </Label>
              <Select name="planName" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pro">Pro Plan</SelectItem>
                  <SelectItem value="Advanced">Advanced Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="billingInterval" className="text-right">
                Interval
              </Label>
              <Select name="billingInterval" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3 flex items-center space-x-2 pt-2">
                <Checkbox id="isTrial" name="isTrial" />
                <Label
                  htmlFor="isTrial"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Start 14-day trial for this plan
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
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
