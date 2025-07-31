// src/components/admin/StatusManager.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { updateLeadStatus } from "@/app/admin/actions";
import { toast } from "sonner";

type Status = "new" | "contacted" | "qualified" | "unqualified" | "converted";

const statuses: Status[] = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
];

export function StatusManager({
  leadId,
  currentStatus,
}: {
  leadId: number;
  currentStatus: Status;
}) {
  const handleStatusChange = async (newStatus: Status) => {
    const formData = new FormData();
    formData.append("lead_id", String(leadId));
    formData.append("status", newStatus);

    const result = await updateLeadStatus(formData);

    if (result.error) {
      toast.error("Failed to update status", { description: result.error });
    } else {
      toast.success(result.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className="capitalize cursor-pointer hover:ring-2 hover:ring-ring"
        >
          {currentStatus}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onSelect={() => handleStatusChange(status)}
            disabled={status === currentStatus}
          >
            <span className="capitalize">{status}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
