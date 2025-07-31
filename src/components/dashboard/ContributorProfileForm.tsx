// src/components/dashboard/ContributorProfileForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { updateContributorProfile } from "@/app/dashboard/account/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

// === THIS IS THE FIX ===
// We make the properties optional with a '?' to match the data we are passing in.
interface ContributorProfile {
  bio?: string | null;
  specialties?: string[] | null;
  portfolio_url?: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Contributor Profile"}
    </Button>
  );
}

export default function ContributorProfileForm({
  profile,
}: {
  profile: ContributorProfile | null;
}) {
  const initialState = { message: null, error: null, success: false };
  const [state, dispatch] = useActionState(
    updateContributorProfile,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Success!", { description: state.message });
    } else if (state.error) {
      toast.error("Error", { description: state.error });
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="bio">Your Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile?.bio || ""}
        />
        <p className="text-xs text-gray-500">
          A short biography that will appear on your public contributor profile.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialties">Specialties</Label>
        <Input
          id="specialties"
          name="specialties"
          defaultValue={profile?.specialties?.join(", ") || ""}
        />
        <p className="text-xs text-gray-500">
          List your areas of expertise, separated by commas (e.g., SaaS, Home
          Security, AI Tools).
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="portfolioUrl">Portfolio/Website URL</Label>
        <Input
          id="portfolioUrl"
          name="portfolioUrl"
          type="url"
          defaultValue={profile?.portfolio_url || ""}
        />
        <p className="text-xs text-gray-500">
          Link to your personal website or portfolio for others to see your
          work.
        </p>
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
