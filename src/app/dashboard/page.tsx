// src/app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import ActivitySnapshot from "@/components/dashboard/ActivitySnapshot";
import SmartRecommendations from "@/components/dashboard/SmartRecommendations"; // Add this import

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // We can fetch all our data in parallel for better performance
  const [profileRes, activityStatsRes, recommendationsRes] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).single(),
    supabase.rpc("get_user_activity_stats").single(),
    supabase.rpc("get_user_recommendations", { p_user_id: user!.id }),
  ]);

  const profile = profileRes.data;
  const activityStats = activityStatsRes.data;
  const recommendations = recommendationsRes.data;

  // Handle potential errors if needed
  if (activityStatsRes.error)
    console.error("Error fetching activity stats:", activityStatsRes.error);
  if (recommendationsRes.error)
    console.error("Error fetching recommendations:", recommendationsRes.error);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {profile?.full_name?.split(" ")[0] || "User"} 👋
      </h1>
      <p className="mt-2 text-gray-600">
        Here&apos;s a snapshot of your activity and impact on the Revuoo
        community.
      </p>

      {activityStats && <ActivitySnapshot stats={activityStats} />}

      {/* Display the SmartRecommendations component */}
      {recommendations && (
        <SmartRecommendations recommendations={recommendations} />
      )}
    </div>
  );
}
