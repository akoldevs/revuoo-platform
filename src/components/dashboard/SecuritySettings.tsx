// src/components/dashboard/SecuritySettings.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateUserPassword } from "@/app/dashboard/account/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

function SubmitButton({ hasPassword }: { hasPassword: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : hasPassword ? "Change Password" : "Set Password"}
    </Button>
  );
}

export default function SecuritySettings({
  hasPassword,
}: {
  hasPassword: boolean;
}) {
  const initialState = { message: null, error: null, success: false };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch] = useActionState(updateUserPassword, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Password updated!", {
        position: "top-right",
        description: state.message,
        style: { marginTop: "80px" },
      });
      formRef.current?.reset();
    } else if (state.error) {
      toast.error("Error updating password", {
        position: "top-right",
        description: state.error,
        style: { marginTop: "80px" },
      });
    }
  }, [state]);

  return (
    <section
      className="mt-8 max-w-lg"
      aria-labelledby="security-settings-title"
      role="form"
    >
      <h2 id="security-settings-title" className="text-xl font-semibold mb-4">
        Security Settings
      </h2>

      <form ref={formRef} action={dispatch} className="space-y-6">
        {/* 🚧 Future enhancement for added security */}
        {hasPassword && (
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
          />
          <p className="text-xs text-gray-500">
            Must be at least 8 characters long.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
          />
        </div>

        <div>
          <SubmitButton hasPassword={hasPassword} />
        </div>
      </form>
    </section>
  );
}
