// src/app/dashboard/contributor/page.tsx

import { createClient } from "@/lib/supabase/server";
import SmartEarningsModule from "@/components/contributor/SmartEarningsModule";
import ActiveAssignments from "@/components/contributor/ActiveAssignments";
import PerformanceCoach from "@/components/contributor/PerformanceCoach";
import CredibilityHub from "@/components/contributor/CredibilityHub"; // ✅ Import the new component
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator"; // Import Separator for styling

// Loading skeletons for a better user experience
function PerformanceCoachSkeleton() {
  return (
    <div className="p-6 bg-card border rounded-lg animate-pulse">
      <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
  );
}

function CredibilityHubSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-6 bg-muted rounded w-1/4"></div>
      <div className="h-20 bg-muted rounded-lg"></div>
      <div className="h-6 bg-muted rounded w-1/3 mt-4"></div>
      <div className="h-24 bg-muted rounded-lg"></div>
    </div>
  );
}

export default async function ContributorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Contributor Hub</h1>
        <p className="mt-4 text-destructive">
          Could not authenticate user. Please log in again.
        </p>
      </div>
    );
  }

  // Fetch all necessary data in parallel
  const [
    { data: earnings, error: earningsError },
    { data: activeAssignments, error: assignmentsError },
  ] = await Promise.all([
    supabase.rpc("get_contributor_earnings_summary").single(),
    supabase
      .from("assignments")
      .select("*")
      .eq("contributor_id", user.id)
      .eq("status", "claimed")
      .order("created_at", { ascending: false }),
  ]);

  if (earningsError)
    console.error("Error fetching earnings summary:", earningsError);
  if (assignmentsError)
    console.error("Error fetching active assignments:", assignmentsError);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contributor Hub</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to your command center. Track your earnings, find new
          assignments, and see your impact.
        </p>
      </div>

      {/* Earnings Module */}
      {earnings ? (
        <SmartEarningsModule earnings={earnings} />
      ) : (
        <div className="p-8 bg-card rounded-lg border">
          <p className="text-muted-foreground">Could not load earnings data.</p>
        </div>
      )}

      {/* AI Performance Coach */}
      <Suspense fallback={<PerformanceCoachSkeleton />}>
        <PerformanceCoach />
      </Suspense>

      {/* ✅ Credibility Hub placed here */}
      <Separator />
      <Suspense fallback={<CredibilityHubSkeleton />}>
        <CredibilityHub />
      </Suspense>
      <Separator />

      {/* Active Assignments Module */}
      <ActiveAssignments assignments={activeAssignments || []} />
    </div>
  );
}
