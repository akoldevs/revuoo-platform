// src/components/admin/KanbanCard.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link"; // ✅ 1. Import Link

export type Lead = {
  lead_id: number;
  profile_id: string;
  full_name: string | null;
  email: string;
  status: string;
  source: string | null;
  created_at: string;
  notes: string | null; // <-- Add this line
};

export function KanbanCard({ lead }: { lead: Lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.lead_id,
    data: {
      type: "Lead",
      lead,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // The Drag Overlay version remains the same
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 bg-card rounded-lg border-2 border-primary opacity-50 h-[150px]"
      ></div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      {/* ✅ 2. Wrap the card in a Link component */}
      <Link href={`/admin/sales/leads/${lead.lead_id}`}>
        <div {...attributes} {...listeners}>
          <Card className="mb-4 hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-base font-semibold">
                {lead.full_name || "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
              <p>{lead.email}</p>
              <p className="mt-2">
                Added: {format(new Date(lead.created_at), "MMM d, yyyy")}
              </p>
              {lead.source && (
                <Badge variant="outline" className="mt-3">
                  {lead.source}
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </Link>
    </div>
  );
}
