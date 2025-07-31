"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { claimAssignment } from "@/app/actions/contributorActions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const initialState: { success: string | null; error: string | null } = {
  success: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Claiming...
        </>
      ) : (
        "Claim Assignment"
      )}
    </Button>
  );
}

export function ClaimButton({ assignmentId }: { assignmentId: number }) {
  // ✅ FIX: The server action is now passed directly to useActionState.
  // This avoids the .bind() method and resolves the import error.
  const [state, formAction] = useActionState(claimAssignment, initialState);

  useEffect(() => {
    if (state.error) {
      toast.error("Claim Failed", {
        description: state.error,
      });
    }
    if (state.success) {
      toast.success("Success!", {
        description: state.success,
      });
    }
  }, [state]);

  return (
    // ✅ FIX: The assignmentId is now passed via a hidden input field.
    <form action={formAction}>
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <SubmitButton />
    </form>
  );
}
