// src/app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import ActivitySnapshot from "@/components/dashboard/ActivitySnapshot";
import SmartRecommendations from "@/components/dashboard/SmartRecommendations";
import { notFound } from "next/navigation";

// This type defines the structure of a recommended business, ensuring it
// matches the props expected by the SmartRecommendations component.
type RecommendedBusiness = {
  id: string;
  title: string;
  description: string | null;
  cta_link: string;
  cta_text: string;
  name: string;
  slug: string;
  revuoo_score: number | null;
};

// This type defines the shape of the object returned by the RPC call.
type RecommendationData = {
  businesses: RecommendedBusiness[];
};

// A clear type for the user's activity statistics.
type ActivityStats = {
  reviews_written: number;
  comments_posted: number;
  upvotes_received: number;
};

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Fetch all necessary data in parallel for optimal performance.
  const [profileRes, activityStatsRes, recommendationsRes] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase.rpc("get_user_activity_stats").single<ActivityStats>(),
    // This RPC call fetches the recommendation data and expects a single object.
    supabase
      .rpc("get_user_recommendations", { p_user_id: user.id })
      .single<RecommendationData>(),
  ]);

  const profile = profileRes.data;
  const activityStats = activityStatsRes.data;
  const recommendationsData = recommendationsRes.data;

  // Log any potential errors to the server console for debugging.
  if (activityStatsRes.error)
    console.error(
      "Error fetching activity stats:",
      activityStatsRes.error.message
    );
  if (recommendationsRes.error)
    console.error(
      "Error fetching recommendations:",
      recommendationsRes.error.message
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Here&apos;s a snapshot of your activity and impact on the Revuoo
          community.
        </p>
      </div>

      {activityStats && <ActivitySnapshot stats={activityStats} />}

      {/* Render recommendations only if the data and the businesses array exist. */}
      {recommendationsData &&
        recommendationsData.businesses &&
        recommendationsData.businesses.length > 0 && (
          <SmartRecommendations data={recommendationsData} />
        )}
    </div>
  );
}
