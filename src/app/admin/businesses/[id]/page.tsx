// src/app/admin/businesses/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Business360View } from "@/components/admin/Business360View";

// --- Type Definitions ---

// ✅ FIX: Defined a specific type for a Review to replace 'any'
type Review = {
  id: string | number;
  title: string;
  summary: string | null;
  overall_rating: number;
  created_at: string;
  author_name: string | null;
};

type ConnectedIntegration = {
  name: string;
  category: string;
  is_connected: boolean;
  connected_at: string;
};

// ✅ FIX: Updated the main data type to use the new, specific Review type
type Business360Data = {
  id: number;
  name: string;
  website_url: string | null;
  is_verified: boolean;
  created_at: string;
  total_reviews: number;
  average_rating: number;
  recent_user_reviews: Review[] | null; // Replaced any[]
  subscription_plan: string | null;
  subscription_status: string | null;
  expert_reviews: Review[] | null; // Replaced any[]
  connected_integrations: ConnectedIntegration[] | null;
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
    .returns<Business360Data>()
    .single();

  if (error || !data) {
    console.error("Error fetching business 360 view:", error);
    return notFound();
  }

  return <Business360View initialBusiness={data} />;
}
