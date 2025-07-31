// src/components/admin/LeadsManager.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KanbanBoard } from "./KanbanBoard";
import { type Lead } from "./KanbanCard";
import { AddLeadModal } from "./AddLeadModal"; // ✅ 1. Import the new modal

export async function LeadsManager() {
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .rpc("get_all_leads")
    .returns<Lead[]>();

  if (error) {
    console.error("Error fetching leads:", error);
    return <p className="text-red-500">Failed to load leads.</p>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Leads Pipeline</h2>
        {/* ✅ 2. Add the "Add New Lead" button */}
        <AddLeadModal />
      </div>
      <KanbanBoard initialLeads={leads || []} />
    </div>
  );
}
