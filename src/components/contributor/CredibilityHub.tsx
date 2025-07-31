// src/components/contributor/CredibilityHub.tsx
import { createClient } from "@/lib/supabase/server";
import { Award, BadgeCheck, Eye, FileText, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define TypeScript types for our data
type Badge = {
  id: string;
  name: string;
  description: string;
  icon_svg: string | null;
  criteria_type: string;
  criteria_value: {
    count?: number;
    views?: number;
    category_slug?: string;
  };
};

type EarnedBadge = {
  id: string;
  name: string;
  description: string;
  icon_svg: string | null;
  earned_at: string;
};

type ContributorStats = {
  total_approved_reviews: number;
  total_views: number;
  reviews_per_category: Record<string, number> | null;
};

// A helper to pick an icon based on the badge name
const BadgeIcon = ({ name }: { name: string }) => {
  if (name.toLowerCase().includes("saas")) return <Star className="h-6 w-6" />;
  if (name.toLowerCase().includes("first"))
    return <Award className="h-6 w-6" />;
  if (name.toLowerCase().includes("master")) return <Eye className="h-6 w-6" />;
  return <FileText className="h-6 w-6" />;
};

export default async function CredibilityHub() {
  const supabase = await createClient();

  // Fetch all data in parallel for maximum performance
  const [
    { data: allBadgesData },
    { data: earnedBadgesData },
    { data: statsData },
  ] = await Promise.all([
    supabase.from("badges").select("*"),
    supabase.rpc("get_my_earned_badges"),
    supabase.rpc("get_my_credibility_stats").single(),
  ]);

  const allBadges: Badge[] = allBadgesData || [];
  const earnedBadges: EarnedBadge[] = earnedBadgesData || [];

  // ✅ FIX: This safely handles all cases, including when statsData is an empty object.
  const stats: ContributorStats =
    statsData &&
    typeof statsData === "object" &&
    "total_approved_reviews" in statsData
      ? (statsData as ContributorStats) // Cast only if it's an object and has the property
      : {
          total_approved_reviews: 0,
          total_views: 0,
          reviews_per_category: null,
        };

  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.id));
  const inProgressBadges = allBadges.filter((b) => !earnedBadgeIds.has(b.id));

  // Helper function to calculate progress
  const calculateProgress = (badge: Badge) => {
    let current = 0;
    let target = 1;

    switch (badge.criteria_type) {
      case "TOTAL_REVIEWS":
        current = stats.total_approved_reviews;
        target = badge.criteria_value.count || 1;
        break;
      case "TOTAL_VIEWS":
        current = stats.total_views;
        target = badge.criteria_value.views || 1;
        break;
      case "CATEGORY_COUNT":
        const slug = badge.criteria_value.category_slug || "";
        current = stats.reviews_per_category?.[slug] || 0;
        target = badge.criteria_value.count || 1;
        break;
    }
    const percentage = Math.min(100, (current / target) * 100);
    return { current, target, percentage };
  };

  return (
    <div className="space-y-8">
      {/* Section for Earned Badges */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <TooltipProvider>
              {earnedBadges.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-card text-green-500">
                      <BadgeCheck className="h-10 w-10" />
                      <p className="mt-2 font-bold text-sm text-card-foreground">
                        {badge.name}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            You haven&apos;t earned any badges yet. Keep writing!
          </p>
        )}
      </div>

      {/* Section for Badges in Progress */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Unlock Your Next Badge</h3>
        <div className="space-y-6">
          {inProgressBadges.map((badge) => {
            const { current, target, percentage } = calculateProgress(badge);
            return (
              <div key={badge.id} className="p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-full text-muted-foreground">
                    <BadgeIcon name={badge.name} />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-card-foreground">
                      {badge.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {badge.description}
                    </p>
                    <Progress value={percentage} className="mt-2 h-2" />
                    <p className="text-xs text-right text-muted-foreground mt-1">
                      {current} / {target}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
