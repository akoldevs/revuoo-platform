// src/components/admin/LeadsManager.tsx
import { createClient } from "@/lib/supabase/server";
// ✅ FIX: Removed unused Card component imports to clean up linting errors.
import { KanbanBoard } from "./KanbanBoard";
import { type Lead } from "./KanbanCard";
import { AddLeadModal } from "./AddLeadModal";

export async function LeadsManager() {
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .rpc("get_all_leads")
    .returns<Lead[]>();

  if (error) {
    console.error("Error fetching leads:", error);
    return <p className="text-red-500">Failed to load leads.</p>;
  }

  // ✅ FIX: Add a type guard to ensure 'leads' is an array before rendering.
  // This resolves the TypeScript error.
  const safeLeads = Array.isArray(leads) ? leads : [];

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Leads Pipeline</h2>
        <AddLeadModal />
      </div>
      <KanbanBoard initialLeads={safeLeads} />
    </div>
  );
}
