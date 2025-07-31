// src/app/admin/sales/page.tsx
import { HeartHandshake } from "lucide-react";
import { LeadsManager } from "@/components/admin/LeadsManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { OpportunitiesKanbanBoard } from "@/components/admin/OpportunitiesKanbanBoard";

export const dynamic = "force-dynamic";

export default async function SalesCrmPage() {
  const supabase = await createClient();
  const { data: opportunities, error } = await supabase.rpc(
    "get_all_opportunities"
  );

  if (error) {
    console.error("Error fetching opportunities", error);
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HeartHandshake className="h-8 w-8" /> Sales CRM
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track and manage potential business customers through the sales
          pipeline.
        </p>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>
        <TabsContent value="leads">
          <LeadsManager />
        </TabsContent>
        <TabsContent value="opportunities">
          <OpportunitiesKanbanBoard
            initialOpportunities={opportunities || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
