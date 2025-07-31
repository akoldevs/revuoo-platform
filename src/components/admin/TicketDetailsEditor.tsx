// src/components/admin/TicketDetailsEditor.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { updateTicketDetails } from "@/app/admin/actions";

type Ticket = {
  ticket_id: number;
  subject: string;
  status: string;
  priority: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function TicketDetailsEditor({ ticket }: { ticket: Ticket }) {
  async function handleSubmit(formData: FormData) {
    const result = await updateTicketDetails(formData);
    if (result.error) {
      toast.error("Failed to update ticket", { description: result.error });
    } else {
      toast.success(result.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="ticket_id" value={ticket.ticket_id} />
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              defaultValue={ticket.subject}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={ticket.status}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" defaultValue={ticket.priority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
