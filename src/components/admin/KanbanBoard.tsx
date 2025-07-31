// src/components/admin/KanbanBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { KanbanCard, type Lead } from "./KanbanCard";
import { updateLeadDetails } from "@/app/admin/actions";
import { toast } from "sonner";

type KanbanColumnData = {
  id: string;
  title: string;
};

const columns: KanbanColumnData[] = [
  { id: "new", title: "New" },
  { id: "contacted", title: "Contacted" },
  { id: "qualified", title: "Qualified" },
  { id: "unqualified", title: "Unqualified" },
  { id: "converted", title: "Converted" },
];

function KanbanColumn({
  column,
  leads,
}: {
  column: KanbanColumnData;
  leads: Lead[];
}) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="bg-muted/50 p-4 rounded-lg flex flex-col gap-4"
    >
      <h3 className="font-semibold text-lg">{column.title}</h3>
      <SortableContext items={leads.map((lead) => lead.lead_id)}>
        <div className="space-y-4 min-h-[200px]">
          {leads.map((lead) => (
            <KanbanCard key={lead.lead_id} lead={lead} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Lead") {
      setActiveLead(event.active.data.current.lead);
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    let newStatus = columns.find((c) => c.id === over.id)?.id;
    if (!newStatus) {
      const overLead = leads.find((l) => l.lead_id === over.id);
      newStatus = overLead?.status;
    }

    const activeLead = leads.find((l) => l.lead_id === activeId);

    if (!activeLead || !newStatus) return;
    if (activeLead.status === newStatus) return;

    // ✅ FIX: Perform the optimistic UI update immediately.
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.lead_id === activeId
          ? { ...lead, status: newStatus as Lead["status"] }
          : lead
      )
    );

    const formData = new FormData();
    formData.append("lead_id", String(activeId));
    formData.append("status", newStatus);

    const result = await updateLeadDetails(formData);

    if (result.error) {
      toast.error("Failed to update status", { description: result.error });
      // On error, revert to the original state from the server
      setLeads(initialLeads);
    } else {
      toast.success(result.message);
      // On success, tell Next.js to refresh the server state in the background.
      // The UI will already look correct because of our optimistic update.
      router.refresh();
    }
  }

  if (!isMounted) {
    // To prevent hydration errors, we can render a skeleton or null on the server.
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            leads={leads.filter((lead) => lead.status === col.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead && <KanbanCard lead={activeLead} />}
      </DragOverlay>
    </DndContext>
  );
}
