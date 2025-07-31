// src/components/admin/AssigneeManager.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignSupportTicket } from "@/app/admin/actions";
import { toast } from "sonner";

type StaffMember = {
  id: string;
  full_name: string | null;
};

type Props = {
  ticketId: number;
  currentAssigneeId: string | null;
  staff: StaffMember[];
};

export function AssigneeManager({ ticketId, currentAssigneeId, staff }: Props) {
  const handleAssignmentChange = async (newAssigneeId: string) => {
    const formData = new FormData();
    formData.append("ticket_id", String(ticketId));
    formData.append("assignee_id", newAssigneeId);

    const result = await assignSupportTicket(formData);

    if (result.error) {
      toast.error("Failed to assign ticket", { description: result.error });
    } else {
      toast.success(result.message);
    }
  };

  return (
    <Select
      value={currentAssigneeId || ""}
      onValueChange={handleAssignmentChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent>
        {staff.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.full_name || "Unnamed Staff"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
