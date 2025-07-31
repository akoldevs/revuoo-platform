// src/components/dashboard/PrivacySettingsForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { updatePrivacySettings } from "@/app/dashboard/account/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Profile {
  is_profile_public: boolean | null;
  prefers_anonymous_reviews: boolean | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Privacy Settings"}
    </Button>
  );
}

export default function PrivacySettingsForm({
  profile,
}: {
  profile: Profile | null;
}) {
  const initialState = { message: null, error: null, success: false };
  const [state, dispatch] = useActionState(updatePrivacySettings, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Success!", { description: state.message });
    } else if (state.error) {
      toast.error("Error", { description: state.error });
    }
  }, [state]);

  const handleDeleteAccount = () => {
    // In a real app, this would call a server action to start the deletion process.
    toast.error("Account Deletion is a critical action.", {
      description: "This feature is not yet implemented.",
    });
  };

  return (
    <div className="space-y-12">
      <form action={dispatch} className="space-y-8 max-w-lg">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="isProfilePublic">Public Profile</Label>
            <p className="text-xs text-gray-500">
              Allow others to see your profile and reviews.
            </p>
          </div>
          <Switch
            id="isProfilePublic"
            name="isProfilePublic"
            defaultChecked={profile?.is_profile_public ?? true}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="prefersAnonymous">Post Reviews Anonymously</Label>
            <p className="text-xs text-gray-500">
              Your name will be hidden on any new reviews you post.
            </p>
          </div>
          <Switch
            id="prefersAnonymous"
            name="prefersAnonymous"
            defaultChecked={profile?.prefers_anonymous_reviews ?? false}
          />
        </div>
        <div>
          <SubmitButton />
        </div>
      </form>

      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold">Account Management</h3>
        <div className="mt-6 p-4 rounded-lg border border-red-300 bg-red-50 max-w-lg">
          <h4 className="font-semibold text-red-800">Danger Zone</h4>
          <p className="text-sm text-red-700 mt-1">
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" disabled>
              Export My Data
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete My Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all of your reviews, comments, and
                    other contributions from Revuoo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
