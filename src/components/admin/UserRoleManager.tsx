// src/components/admin/UserRoleManager.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { assignUserRole } from "@/app/admin/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useFormStatus } from "react-dom";

type Role = {
  id: string;
  name: string;
};

type Props = {
  userId: string;
  currentRoleId: string | null;
  allRoles: Role[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export function UserRoleManager({ userId, currentRoleId, allRoles }: Props) {
  const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId);

  const assignRoleAction = async (formData: FormData) => {
    const result = await assignUserRole(formData);
    if (result.error) {
      toast.error("Failed to update role", { description: result.error });
    } else {
      toast.success(result.message);
    }
  };

  return (
    <form action={assignRoleAction} className="flex items-center gap-2">
      <input type="hidden" name="user_id" value={userId} />
      <Select
        name="role_id"
        value={selectedRoleId || ""}
        onValueChange={setSelectedRoleId}
        required
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Assign a role..." />
        </SelectTrigger>
        <SelectContent>
          {allRoles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <SubmitButton />
    </form>
  );
}
