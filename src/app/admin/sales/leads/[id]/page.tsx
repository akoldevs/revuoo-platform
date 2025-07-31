// src/app/admin/sales/leads/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { LeadDetailsEditor } from "@/components/admin/LeadDetailsEditor";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { ConvertLeadModal } from "@/components/admin/ConvertLeadModal"; // ✅ 1. Import the modal

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const leadId = Number(params.id);

  // ✅ 2. Fetch both the lead details and all available plans in parallel
  const [leadRes, plansRes] = await Promise.all([
    supabase.rpc("get_lead_details", { p_lead_id: leadId }).single(),
    supabase.from("plans").select("name, price_monthly"),
  ]);

  const lead = leadRes.data;
  const plans = plansRes.data || [];

  if (leadRes.error || !lead) {
    console.error("Error fetching lead details:", leadRes.error);
    notFound();
  }

  return (
    <>
      <Toaster richColors />
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/admin/sales">
            <Button variant="outline">← Back to Sales CRM</Button>
          </Link>
          {/* ✅ 3. Add the "Convert" button if the lead is not already converted */}
          {lead.status !== "converted" && (
            <ConvertLeadModal leadId={lead.lead_id} plans={plans} />
          )}
        </div>

        {/* Top Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {lead.full_name || "N/A"}
            </CardTitle>
            <CardDescription>{lead.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  Lead ID: <span className="font-semibold">{lead.lead_id}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Added: {format(new Date(lead.created_at), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>
                  Source: <span className="font-semibold">{lead.source}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Editor Component */}
        <LeadDetailsEditor lead={lead} />

        {/* ActivityFeed Component */}
        <ActivityFeed leadId={lead.lead_id} />
      </div>
    </>
  );
}
