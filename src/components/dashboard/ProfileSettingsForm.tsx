// src/components/dashboard/ProfileSettingsForm.tsx
"use client";

import { useActionState, useEffect } from "react"; // <-- CHANGED: useActionState from 'react'
import { useFormStatus } from "react-dom";
import { updateUserProfile } from "@/app/dashboard/account/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Profile {
  full_name: string | null;
  username: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export default function ProfileSettingsForm({
  profile,
}: {
  profile: Profile | null;
}) {
  const initialState = { message: null, error: null, success: false };

  // CHANGED: useFormState is now useActionState
  const [state, dispatch] = useActionState(updateUserProfile, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      toast.success("Success!", { description: state.message });
    } else if (state.error) {
      toast.error("Error", { description: state.error });
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile?.full_name || ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          defaultValue={profile?.username || ""}
          required
        />
        <p className="text-xs text-gray-500">
          Your public profile URL will be: revuoo.com/profile/
          {profile?.username || "..."}
        </p>
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
