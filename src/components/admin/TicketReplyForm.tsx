// src/components/admin/TicketReplyForm.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { addReplyToTicket } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit Reply"}
    </Button>
  );
}

export function TicketReplyForm({ ticketId }: { ticketId: number }) {
  // Client action to clear the form after submission
  async function handleSubmit(formData: FormData) {
    const result = await addReplyToTicket(formData);

    if (result.error) {
      toast.error("Failed to add reply", { description: result.error });
    } else {
      toast.success("Reply added successfully.");
      // Reset the form fields
      const form = document.getElementById(
        `reply-form-${ticketId}`
      ) as HTMLFormElement;
      form.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id={`reply-form-${ticketId}`}
          action={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="ticket_id" value={ticketId} />
          <div className="space-y-2">
            <Label htmlFor="content">Your Reply</Label>
            <Textarea
              name="content"
              id="content"
              rows={6}
              required
              placeholder="Type your reply here..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="internal_note" name="is_internal_note" />
            <Label htmlFor="internal_note">
              Make this an internal note (only visible to admins)
            </Label>
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
