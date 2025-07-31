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
import { Textarea } from "@/components/ui/textarea";
import { useFormStatus } from "react-dom";
import { rejectExpertReview } from "@/app/admin/actions";
import { toast } from "sonner";
import { useRef } from "react";

// A submit button that shows a pending state while the server action is running.
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Submitting..." : "Reject and Send Feedback"}
    </Button>
  );
}

export function RejectWithFeedbackModal({
  isOpen,
  onClose,
  reviewId,
  reviewTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string | null;
  reviewTitle: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  // This is the modern way to handle form submissions in Next.js.
  // It calls the server action and provides feedback without a full page reload.
  const formAction = async (formData: FormData) => {
    const result = await rejectExpertReview(formData);
    if (result?.error) {
      toast.error("Failed to reject review", {
        description: result.error,
      });
    } else {
      toast.success("Review Rejected", {
        description: "The contributor has been notified.",
      });
      formRef.current?.reset();
      onClose();
    }
  };

  if (!isOpen || !reviewId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Review: &quot;{reviewTitle}&quot;</DialogTitle>
          <DialogDescription>
            Provide constructive feedback to the contributor explaining why this
            review is being rejected. This will be visible to them in their
            dashboard.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef}>
          <input type="hidden" name="reviewId" value={reviewId} />
          <div className="grid gap-4 py-4">
            <Textarea
              id="feedback"
              name="feedback"
              placeholder="e.g., 'The review summary is too brief. Please elaborate on the key pros and cons.'"
              className="min-h-[120px]"
              required
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
