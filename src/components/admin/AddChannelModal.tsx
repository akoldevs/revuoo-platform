// src/components/admin/AddChannelModal.tsx
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
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createChatChannel } from "@/app/admin/actions";
import { Plus } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Channel"}
    </Button>
  );
}

export function AddChannelModal() {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await createChatChannel(formData);
    if (result.error) {
      toast.error("Failed to create channel", { description: result.error });
    } else {
      toast.success(result.message);
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new channel</DialogTitle>
          <DialogDescription>
            Channels are where your team communicates. They’re best when
            organized around a topic — for example, #support-tickets.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              name="name"
              id="name"
              required
              placeholder="e.g. marketing-campaign"
            />
            <p className="text-xs text-muted-foreground">
              Names must be lowercase, without spaces or special characters.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              name="description"
              id="description"
              placeholder="What's this channel about?"
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
