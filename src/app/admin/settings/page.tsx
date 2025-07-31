// src/app/admin/settings/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Settings } from "lucide-react";
import { SettingsPageClient } from "@/components/admin/SettingsPageClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  // ✅ Fetch ALL data needed for ALL tabs
  const [
    rolesRes,
    allPermissionsRes,
    categoriesRes,
    plansRes,
    discountsRes,
    allFeaturesRes, // ✅ Fetch the master list of all features
  ] = await Promise.all([
    supabase
      .from("roles")
      .select(`id, name, description, permissions ( id, name, description )`),
    supabase.from("permissions").select("*"),
    supabase.from("categories").select("*").order("name"),
    // ✅ Fetch plans AND their currently linked features
    supabase
      .from("plans")
      .select(`*, features:plan_features(feature_id)`)
      .order("price_monthly"),
    supabase.rpc("get_all_discounts_with_redemption_counts"),
    supabase.from("features").select("*").order("name"),
  ]);

  const error =
    rolesRes.error ||
    allPermissionsRes.error ||
    categoriesRes.error ||
    plansRes.error ||
    discountsRes.error ||
    allFeaturesRes.error;
  if (error) {
    console.error("Error fetching settings data:", error);
    return (
      <div className="text-red-500 p-4">Failed to load settings data.</div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" /> System Settings
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage platform-wide configurations and taxonomies.
        </p>
      </div>

      {/* Pass all the fetched data to our single, powerful client component */}
      <SettingsPageClient
        roles={rolesRes.data || []}
        allPermissions={allPermissionsRes.data || []}
        categories={categoriesRes.data || []}
        plans={plansRes.data || []}
        discounts={discountsRes.data || []}
        allFeatures={allFeaturesRes.data || []}
      />
    </div>
  );
}
