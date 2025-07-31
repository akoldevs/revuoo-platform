// src/components/admin/LeadDetailsEditor.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { updateLeadDetails } from "@/app/admin/actions";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { type Lead } from "./KanbanCard"; // Use the shared Lead type

const statuses: Lead["status"][] = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function LeadDetailsEditor({ lead }: { lead: Lead }) {
  const updateDetailsAction = async (formData: FormData) => {
    const result = await updateLeadDetails(formData);
    if (result.error) {
      toast.error("Failed to update lead", { description: result.error });
    } else {
      toast.success(result.message);
    }
  };

  return (
    <form action={updateDetailsAction}>
      <input type="hidden" name="lead_id" value={lead.lead_id} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Notes */}
        <div className="md:col-span-2">
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
                defaultValue={lead.notes || ""}
                rows={10}
                placeholder="Add a note..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="status">Update Lead Status</Label>
              <Select name="status" defaultValue={lead.status}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <span className="capitalize">{status}</span>
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
