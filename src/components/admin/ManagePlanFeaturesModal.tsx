// src/components/admin/ManagePlanFeaturesModal.tsx
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { updatePlanFeatures } from "@/app/admin/actions";

type Feature = {
  id: string;
  name: string;
  description: string | null;
};

type PlanWithFeatures = {
  id: string;
  name: string;
  features: { feature_id: string }[];
};

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlanWithFeatures | null;
  allFeatures: Feature[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Features"}
    </Button>
  );
}

export function ManagePlanFeaturesModal({
  isOpen,
  onOpenChange,
  plan,
  allFeatures,
}: Props) {
  async function handleSubmit(formData: FormData) {
    const result = await updatePlanFeatures(formData);
    if (result.error) {
      toast.error("Failed to update features", { description: result.error });
    } else {
      toast.success(result.message);
      onOpenChange(false);
    }
  }

  const planFeatureIds = new Set(plan?.features.map((f) => f.feature_id) || []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Features for {plan?.name}</DialogTitle>
          <DialogDescription>
            Select the features that should be available for this plan.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <input type="hidden" name="plan_id" value={plan?.id || ""} />
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {allFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50"
              >
                <Checkbox
                  id={`feature-${feature.id}`}
                  name="feature_ids"
                  value={feature.id}
                  defaultChecked={planFeatureIds.has(feature.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={`feature-${feature.id}`}
                    className="font-medium"
                  >
                    {feature.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
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
