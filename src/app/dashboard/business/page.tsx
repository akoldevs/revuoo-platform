// src/app/dashboard/business/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Eye, MessageSquare } from "lucide-react";
import RecentReviews from "@/components/dashboard/RecentReviews";
import ProfileCompleteness from "@/components/dashboard/ProfileCompleteness";

// Define a specific type for a day's operating hours
type DayHours =
  | {
      open: string;
      close: string;
    }
  | { closed: true };

// Define a structure for the entire week's operating hours
type OperatingHours = {
  [key in
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"]?: DayHours;
};

type BusinessStats = {
  total_reviews: number;
  average_rating: number;
  new_reviews_last_30_days: number;
  profile_views_last_30_days: number;
  current_revuoo_score: number;
};

type Review = {
  id: number;
  title: string;
  overall_rating: number | null;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

type BusinessProfile = {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  phone_number: string | null;
  website_url: string | null;
  // FIX: Replaced 'any' with a specific type for operating hours.
  operating_hours: OperatingHours | null;
  services: string[] | null;
};

const calculateProfileCompleteness = (business: BusinessProfile) => {
  const fields = [
    {
      key: "description",
      label: "Add a business description",
      href: "/dashboard/business/edit",
    },
    {
      key: "address",
      label: "Add your address",
      href: "/dashboard/business/edit",
    },
    {
      key: "phone_number",
      label: "Add a phone number",
      href: "/dashboard/business/edit",
    },
    {
      key: "website_url",
      label: "Link your website",
      href: "/dashboard/business/edit",
    },
    {
      key: "operating_hours",
      label: "Set your operating hours",
      href: "/dashboard/business/edit",
    },
    {
      key: "services",
      label: "List your services",
      href: "/dashboard/business/edit",
    },
  ];

  let completedFields = 0;
  const missingSteps: { label: string; href: string }[] = [];

  fields.forEach((field) => {
    const value = business[field.key as keyof BusinessProfile];
    // Check for null/undefined, empty arrays, or empty objects
    if (
      value &&
      (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)
    ) {
      completedFields++;
    } else {
      missingSteps.push({ label: field.label, href: field.href });
    }
  });

  const percentage = Math.round((completedFields / fields.length) * 100);
  return { percentage, missingSteps };
};

export const dynamic = "force-dynamic";

export default async function BusinessDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!business) return redirect("/for-businesses");

  const [{ data: statsData }, { data: recentReviewsData }] = await Promise.all([
    supabase.rpc("get_business_dashboard_overview", {
      p_business_id: business.id,
    }),
    supabase
      .from("reviews")
      .select("id, title, overall_rating, created_at, profiles (full_name)")
      .eq("business_id", business.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats =
    statsData && statsData[0] ? (statsData[0] as BusinessStats) : null;
  const recentReviews = (recentReviewsData as Review[] | null) || [];
  const { percentage, missingSteps } = calculateProfileCompleteness(
    business as BusinessProfile
  );

  if (!stats) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard for {business.name}
        </h1>
        <p className="mt-4 text-red-600">
          Could not load business statistics at this time.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Revuoo Score",
      value:
        typeof stats.current_revuoo_score === "number"
          ? stats.current_revuoo_score.toFixed(1)
          : "N/A",
      icon: <Star className="h-5 w-5 text-muted-foreground" />,
    },
    {
      label: "Average Rating",
      value:
        typeof stats.average_rating === "number"
          ? stats.average_rating.toFixed(1)
          : "N/A",
      icon: <Star className="h-5 w-5 text-muted-foreground" />,
    },
    {
      label: "Total Reviews",
      value: stats.total_reviews ?? "N/A",
      icon: <MessageSquare className="h-5 w-5 text-muted-foreground" />,
    },
    {
      label: "Profile Views (30d)",
      value: stats.profile_views_last_30_days ?? "N/A",
      icon: <Eye className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard for {business.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Here&apos;s a performance summary of your business profile on Revuoo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.label}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{String(card.value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentReviews reviews={recentReviews} />
        <ProfileCompleteness
          percentage={percentage}
          missingSteps={missingSteps}
        />
      </div>
    </div>
  );
}
