// src/components/dashboard/CreateTicketModal.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createMySupportTicket } from "@/app/dashboard/actions";
import { PlusCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit Ticket"}
    </Button>
  );
}

// ✅ 1. The component now accepts the current persona
export function CreateTicketModal({
  persona,
}: {
  persona: "user" | "contributor" | "business";
}) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    // ✅ 2. We add the current persona to the form data before submitting
    formData.append("persona", persona);

    const result = await createMySupportTicket(formData);
    if (result.error) {
      toast.error("Submission failed", { description: result.error });
    } else {
      toast.success(result.message);
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Submit a New Ticket
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit a Support Ticket</DialogTitle>
          <DialogDescription>
            This ticket will be submitted from your{" "}
            <span className="font-bold capitalize">{persona}</span> dashboard.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              name="subject"
              id="subject"
              required
              placeholder="e.g., Issue with billing"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Describe your issue</Label>
            <Textarea
              name="content"
              id="content"
              required
              rows={8}
              placeholder="Please provide as much detail as possible..."
            />
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
