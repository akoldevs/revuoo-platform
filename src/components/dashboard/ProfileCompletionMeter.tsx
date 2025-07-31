// src/components/dashboard/ProfileCompletionMeter.tsx
"use client";

import { Progress } from "@/components/ui/progress";

type Profile = {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

export default function ProfileCompletionMeter({
  profile,
}: {
  profile: Profile;
}) {
  const fields = [profile.full_name, profile.username, profile.avatar_url];

  const filled = fields.filter(Boolean).length;
  const percent = Math.round((filled / fields.length) * 100);

  return (
    <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
      <h2 className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-2">
        Profile Completion: {percent}%
      </h2>
      <Progress
        value={percent}
        className="h-2 bg-indigo-200 dark:bg-indigo-800"
      />

      {percent < 100 && (
        <p className="mt-2 text-xs text-indigo-700 dark:text-indigo-300">
          Complete your profile to unlock badges and build contributor trust.
        </p>
      )}
    </div>
  );
}
