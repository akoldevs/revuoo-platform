// src/app/admin/sales/opportunities/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { OpportunityDetailsEditor } from "@/components/admin/OpportunityDetailsEditor";
import { OpportunityActivityFeed } from "@/components/admin/OpportunityActivityFeed"; // ✅ 1. Import the new component

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const opportunityId = Number(params.id);

  const { data: opportunity, error } = await supabase
    .rpc("get_opportunity_details", { p_opportunity_id: opportunityId })
    .single();

  if (error || !opportunity) {
    console.error("Error fetching opportunity details:", error);
    notFound();
  }

  return (
    <>
      <Toaster richColors />
      <div className="w-full space-y-6">
        <Link href="/admin/sales?tab=opportunities">
          <Button variant="outline">← Back to Sales CRM</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Opportunity: {opportunity.full_name || "N/A"}
            </CardTitle>
            <CardDescription>{opportunity.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Current Stage</span>
                <Badge className="capitalize w-fit">
                  {opportunity.stage.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Deal Value</span>
                <span className="font-semibold text-lg">
                  ${opportunity.value}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold">
                  {opportunity.associated_plan_name}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Source</span>
                <span className="font-semibold">{opportunity.lead_source}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ✅ 2. Update the editor to pass the notes field */}
        <OpportunityDetailsEditor opportunity={opportunity} />

        {/* ✅ 3. Add the ActivityFeed component to the page */}
        <OpportunityActivityFeed opportunityId={opportunity.opportunity_id} />
      </div>
    </>
  );
}
