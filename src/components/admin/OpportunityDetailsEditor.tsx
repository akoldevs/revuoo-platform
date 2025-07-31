// src/components/admin/OpportunityDetailsEditor.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOpportunityDetails } from "@/app/admin/actions";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

type Opportunity = {
  opportunity_id: number;
  stage:
    | "discovery"
    | "demo_scheduled"
    | "proposal_sent"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  notes: string | null; // ✅ Ensure notes can be null
};

const stages: Opportunity["stage"][] = [
  "discovery",
  "demo_scheduled",
  "proposal_sent",
  "negotiation",
  "closed_won",
  "closed_lost",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function OpportunityDetailsEditor({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  const updateDetailsAction = async (formData: FormData) => {
    const result = await updateOpportunityDetails(formData);
    if (result.error) {
      toast.error("Failed to update opportunity", {
        description: result.error,
      });
    } else {
      toast.success(result.message);
    }
  };

  return (
    <form action={updateDetailsAction}>
      <input
        type="hidden"
        name="opportunity_id"
        value={opportunity.opportunity_id}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Notes</CardTitle>
              <CardDescription>
                Add notes from calls or emails. These are for internal use only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                name="notes"
                defaultValue={opportunity.notes || ""}
                rows={10}
                placeholder="Add a note..."
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="stage">Update Opportunity Stage</Label>
              <Select name="stage" defaultValue={opportunity.stage}>
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      <span className="capitalize">
                        {stage.replace("_", " ")}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
