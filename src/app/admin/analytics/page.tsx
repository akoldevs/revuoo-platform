// src/app/admin/analytics/page.tsx
import { createClient } from "@/lib/supabase/server";
import { client as sanityClient } from "@/lib/sanity"; // ✅ Use your existing Sanity client
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  Briefcase,
  MessageSquare,
  Star,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

// A reusable component for displaying a key statistic.
function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">Total on platform</p>
      </CardContent>
    </Card>
  );
}

// Define the type for the data from our Supabase function.
type PlatformStats = {
  total_users: number;
  total_businesses: number;
  total_user_reviews: number;
  total_expert_reviews: number;
  average_platform_rating: number;
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // ✅ A+++ ENHANCEMENT: Fetch data from Supabase and Sanity in parallel.
  const [supabaseRes, sanityRes] = await Promise.all([
    supabase
      .rpc("get_platform_analytics_stats")
      .returns<PlatformStats[]>()
      .single(),
    // This is a GROQ query to count all documents of type 'post' in Sanity.
    sanityClient.fetch<number>('count(*[_type == "post"])'),
  ]);

  const { data: stats, error: supabaseError } = supabaseRes;
  const totalGuides = sanityRes || 0;

  if (supabaseError || !stats) {
    console.error("Error fetching platform stats:", supabaseError);
    return (
      <div className="text-red-500 p-4">
        Failed to load platform analytics. Please check the server logs.
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" /> Platform Analytics
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A high-level overview of platform growth and content volume.
        </p>
      </div>

      {/* ✅ UPDATED: The stats grid now includes the new card for guides. */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Users"
          value={stats.total_users || 0}
          icon={Users}
        />
        <StatCard
          title="Total Businesses"
          value={stats.total_businesses || 0}
          icon={Briefcase}
        />
        <StatCard
          title="User Reviews"
          value={stats.total_user_reviews || 0}
          icon={MessageSquare}
        />
        <StatCard
          title="Expert Reviews"
          value={stats.total_expert_reviews || 0}
          icon={Star}
        />
        <StatCard
          title="Published Guides"
          value={totalGuides}
          icon={BookOpen}
        />
        <StatCard
          title="Avg. Platform Rating"
          value={(stats.average_platform_rating || 0).toFixed(1)}
          icon={Star}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          <p>Time-series charts will be added here soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
