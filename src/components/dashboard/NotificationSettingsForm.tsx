// src/components/dashboard/NotificationSettingsForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { updateNotificationSettings } from "@/app/dashboard/account/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

interface Profile {
  wants_review_replies_notifications: boolean | null;
  wants_new_follower_notifications: boolean | null;
  wants_weekly_digest_notifications: boolean | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Preferences"}
    </Button>
  );
}

export default function NotificationSettingsForm({
  profile,
}: {
  profile: Profile | null;
}) {
  const initialState = { message: null, error: null, success: false };
  const [state, dispatch] = useActionState(
    updateNotificationSettings,
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
    <form action={dispatch} className="space-y-8 max-w-lg">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="reviewReplies">Replies to my reviews</Label>
          <p className="text-xs text-gray-500">
            Get notified when a business or user replies to your review.
          </p>
        </div>
        <Switch
          id="reviewReplies"
          name="reviewReplies"
          defaultChecked={profile?.wants_review_replies_notifications ?? true}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="newFollowers">New Followers</Label>
          <p className="text-xs text-gray-500">
            Get notified when another user follows you.
          </p>
        </div>
        <Switch
          id="newFollowers"
          name="newFollowers"
          defaultChecked={profile?.wants_new_follower_notifications ?? true}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="weeklyDigest">Weekly Digest</Label>
          <p className="text-xs text-gray-500">
            Receive a weekly email with top reviews and insights.
          </p>
        </div>
        <Switch
          id="weeklyDigest"
          name="weeklyDigest"
          defaultChecked={profile?.wants_weekly_digest_notifications ?? true}
        />
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
