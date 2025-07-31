// src/components/dashboard/BusinessIntegrationsManager.tsx
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Puzzle, CheckCircle, ArrowUpCircle } from "lucide-react";
import { IntegrationConnectModal } from "./IntegrationConnectModal";
import { IntegrationManageModal } from "./IntegrationManageModal";
import Link from "next/link";

// --- Type Definitions ---
type Integration = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  category: string;
  minimum_plan_tier: "free" | "pro" | "advanced" | "enterprise"; // ✅ Added plan tier
};

type BusinessIntegration = {
  id: number;
  integration_id: string;
  settings: { webhook_url?: string } | null;
};

// A mapping to give each plan tier a numeric value for easy comparison
const PLAN_TIER_HIERARCHY = {
  free: 0,
  pro: 1,
  advanced: 2,
  enterprise: 3,
};

export async function BusinessIntegrationsManager() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch the business and its current plan tier in parallel
  const { data: business } = await supabase
    .from("businesses")
    .select("id, subscriptions(plan_tier)")
    .eq("owner_id", user!.id)
    .single();

  if (!business) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>You must have a claimed business profile to manage integrations.</p>
      </div>
    );
  }

  // @ts-ignore - Supabase types can be tricky with nested arrays
  const businessPlanTier = business.subscriptions[0]?.plan_tier || "free";
  const businessPlanLevel = PLAN_TIER_HIERARCHY[businessPlanTier];

  // 2. Fetch the business's currently connected integrations
  const { data: connectedIntegrationsData } = await supabase
    .from("business_integrations")
    .select("id, integration_id, settings")
    .eq("business_id", business.id);

  const connectedIntegrationsMap = new Map(
    (connectedIntegrationsData || []).map((bi) => [bi.integration_id, bi])
  );

  // 3. Fetch all available integrations
  const { data: allIntegrations, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching integrations for business:", error);
    return <p className="text-red-500">Could not load integrations.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allIntegrations?.map((integration: Integration) => {
        const connection = connectedIntegrationsMap.get(integration.id);
        const requiredPlanLevel =
          PLAN_TIER_HIERARCHY[integration.minimum_plan_tier];
        const hasAccess = businessPlanLevel >= requiredPlanLevel;

        return (
          <Card key={integration.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                  <Puzzle className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle>{integration.name}</CardTitle>
              </div>
              <CardDescription className="pt-4">
                {integration.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <div className="flex justify-between items-center mt-4">
                <Badge variant="outline" className="capitalize">
                  {integration.category}
                </Badge>

                {/* ✅ 4. Intelligent Button Rendering */}
                {connection ? (
                  // If connected, show "Manage"
                  <IntegrationManageModal
                    businessIntegrationId={connection.id}
                    integrationName={integration.name}
                    currentSettings={connection.settings}
                  />
                ) : hasAccess ? (
                  // If they have access but aren't connected, show "Connect"
                  <IntegrationConnectModal
                    integrationId={integration.id}
                    integrationName={integration.name}
                    businessId={business.id}
                  />
                ) : (
                  // If they don't have access, show "Upgrade"
                  <Button asChild variant="secondary">
                    <Link href="/dashboard/business/billing">
                      {" "}
                      {/* Directs them to your pricing/billing page */}
                      <ArrowUpCircle className="mr-2 h-4 w-4" />
                      Upgrade to Unlock
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
