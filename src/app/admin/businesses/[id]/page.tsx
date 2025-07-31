// src/app/admin/businesses/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Business360View } from "@/components/admin/Business360View";

// ✅ Define the type for our new integration data
type ConnectedIntegration = {
  name: string;
  category: string;
  is_connected: boolean;
  connected_at: string;
};

// ✅ Update the main data type to include the new field
type Business360Data = {
  id: number;
  name: string;
  website_url: string | null;
  is_verified: boolean;
  created_at: string;
  total_reviews: number;
  average_rating: number;
  recent_user_reviews: any[] | null;
  subscription_plan: string | null;
  subscription_status: string | null;
  expert_reviews: any[] | null;
  connected_integrations: ConnectedIntegration[] | null; // Add the field here
};

export default async function Business360Page({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const businessId = parseInt(params.id, 10);

  if (isNaN(businessId)) {
    return notFound();
  }

  const { data, error } = await supabase
    .rpc("get_business_360_view", { p_business_id: businessId })
    .returns<Business360Data>() // Use the updated type here
    .single();

  if (error || !data) {
    console.error("Error fetching business 360 view:", error);
    return notFound();
  }

  return <Business360View initialBusiness={data} />;
}
