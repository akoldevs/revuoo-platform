// src/components/admin/OpportunitiesKanbanBoard.tsx
"use client";
import { useMemo, useState, useEffect } from "react";
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
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateOpportunityStage } from "@/app/admin/actions";
import { toast } from "sonner";
import Link from "next/link"; // ✅ 1. Import Link

export type Opportunity = {
  opportunity_id: number;
  lead_id: number;
  full_name: string | null;
  email: string;
  stage: string;
  value: number;
  associated_plan_name: string;
};

type KanbanColumnData = {
  id: string;
  title: string;
};

const columns: KanbanColumnData[] = [
  { id: "discovery", title: "Discovery" },
  { id: "demo_scheduled", title: "Demo Scheduled" },
  { id: "proposal_sent", title: "Proposal Sent" },
  { id: "negotiation", title: "Negotiation" },
  { id: "closed_won", title: "Closed Won" },
  { id: "closed_lost", title: "Closed Lost" },
];

function KanbanCard({ opportunity }: { opportunity: Opportunity }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opportunity.opportunity_id,
    data: {
      type: "Opportunity",
      opportunity,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-card h-[110px] rounded-lg border-2 border-primary opacity-50"
      ></div>
    );
  }

  return (
    // ✅ 2. Wrap the card content in a Link, but keep drag handles on the div
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link href={`/admin/sales/opportunities/${opportunity.opportunity_id}`}>
        <Card className="mb-4 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="p-4">
            <CardTitle className="text-base font-semibold truncate">
              {opportunity.full_name || "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
            <p className="truncate">{opportunity.email}</p>
            <div className="mt-3 flex justify-between items-center">
              <Badge variant="default">${opportunity.value}</Badge>
              <span className="font-semibold text-xs truncate">
                {opportunity.associated_plan_name}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

function KanbanColumn({
  column,
  opportunities,
}: {
  column: KanbanColumnData;
  opportunities: Opportunity[];
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const opportunitiesIds = useMemo(
    () => opportunities.map((opp) => opp.opportunity_id),
    [opportunities]
  );

  return (
    <div
      ref={setNodeRef}
      className="bg-muted/50 p-4 rounded-lg flex flex-col gap-4"
    >
      <h3 className="font-semibold text-lg capitalize">
        {column.title.replace("_", " ")}
      </h3>
      <SortableContext items={opportunitiesIds}>
        <div className="space-y-4 min-h-[200px]">
          {opportunities.map((opp) => (
            <KanbanCard key={opp.opportunity_id} opportunity={opp} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export function OpportunitiesKanbanBoard({
  initialOpportunities,
}: {
  initialOpportunities: Opportunity[];
}) {
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(initialOpportunities);
  const [activeOpportunity, setActiveOpportunity] =
    useState<Opportunity | null>(null);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Opportunity") {
      setActiveOpportunity(event.active.data.current.opportunity);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveOpportunity(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overContainerId = over.data.current?.sortable?.containerId || over.id;
    const newStage = columns.find((c) => c.id === overContainerId)?.id;

    const activeOpportunity = opportunities.find(
      (o) => o.opportunity_id === activeId
    );
    if (!activeOpportunity || !newStage || activeOpportunity.stage === newStage)
      return;

    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.opportunity_id === activeId ? { ...opp, stage: newStage } : opp
      )
    );

    const formData = new FormData();
    formData.append("opportunity_id", String(activeId));
    formData.append("stage", newStage);

    const result = await updateOpportunityStage(formData);

    if (result.error) {
      toast.error("Failed to update stage", { description: result.error });
      setOpportunities(initialOpportunities);
    } else {
      toast.success(result.message);
      router.refresh();
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            opportunities={opportunities.filter((opp) => opp.stage === col.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeOpportunity && <KanbanCard opportunity={activeOpportunity} />}
      </DragOverlay>
    </DndContext>
  );
}
