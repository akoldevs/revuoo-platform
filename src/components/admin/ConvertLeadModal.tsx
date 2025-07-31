// src/components/admin/ConvertLeadModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStatus } from "react-dom";
import { convertLeadToOpportunity } from "@/app/admin/actions";
import { toast } from "sonner";
import { Star } from "lucide-react";

type Plan = {
  name: string;
  price_monthly: number;
};

type Props = {
  leadId: number;
  plans: Plan[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Converting..." : "Convert to Opportunity"}
    </Button>
  );
}

export function ConvertLeadModal({ leadId, plans }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const convertAction = async (formData: FormData) => {
    const result = await convertLeadToOpportunity(formData);
    if (result.error) {
      toast.error("Conversion failed", { description: result.error });
    } else {
      toast.success(result.message);
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>
        <Star className="mr-2 h-4 w-4" />
        Convert to Opportunity
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convert Lead to Opportunity</DialogTitle>
          <DialogDescription>
            Create a new sales opportunity for this lead. This will move them
            into the active sales pipeline.
          </DialogDescription>
        </DialogHeader>
        <form action={convertAction}>
          <input type="hidden" name="lead_id" value={leadId} />
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="plan_name">Potential Plan</Label>
              <Select name="plan_name" required>
                <SelectTrigger id="plan_name" className="mt-2">
                  <SelectValue placeholder="Select a plan..." />
                </SelectTrigger>
                <SelectContent>
                  {plans
                    .filter((p) => p.name.toLowerCase() !== "free")
                    .map((plan) => (
                      <SelectItem key={plan.name} value={plan.name}>
                        {plan.name} (${plan.price_monthly}/mo)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Deal Value ($)</Label>
              {/* ✅ FIX: Added margin-top class for spacing */}
              <Input
                id="value"
                name="value"
                type="number"
                placeholder="e.g., 49.00"
                step="0.01"
                required
                className="mt-2"
              />
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
