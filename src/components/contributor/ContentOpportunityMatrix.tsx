// FINAL CORRECTED VERSION - src/components/contributor/ContentOpportunityMatrix.tsx

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";

type OpportunityAssignment = {
  id: number;
  title: string;
  payout_amount: number;
  demand_score: number;
  categories: { id: string; name: string; slug: string }[] | null;
};

const QUADRANTS = {
  STRATEGIC_PICKS: {
    name: "Strategic Picks",
    description: "High Payout, High Demand",
    className: "bg-green-500/10 border-green-500/30",
  },
  HIDDEN_GEMS: {
    name: "Hidden Gems",
    description: "High Payout, Low Demand",
    className: "bg-blue-500/10 border-blue-500/30",
  },
  HOT_STREAKS: {
    name: "Hot Streaks",
    description: "Low Payout, High Demand",
    className: "bg-yellow-500/10 border-yellow-500/30",
  },
  SIDE_QUESTS: {
    name: "Side Quests",
    description: "Low Payout, Low Demand",
    className: "bg-slate-500/10 border-slate-500/30",
  },
};

export default async function ContentOpportunityMatrix() {
  const supabase = createServerComponentClient({ cookies });

  // FIX: Reverting to your successful data-fetching and typing pattern.
  // This resolves all ts(2558) and implicit 'any' errors.
  const { data, error } = await supabase.rpc(
    "get_opportunity_matrix_assignments"
  );
  const assignments = (data ?? []) as OpportunityAssignment[];

  if (error) {
    console.error("Error fetching opportunity assignments:", error);
    return (
      <div className="text-red-500 p-4">Failed to load opportunities.</div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-card text-card-foreground">
        <h3 className="text-xl font-semibold">No Open Opportunities</h3>
        <p className="text-muted-foreground mt-2">
          Check back later for new assignments!
        </p>
      </div>
    );
  }

  const maxPayout = Math.max(...assignments.map((a) => a.payout_amount), 100);

  // Using your superior getQuadrant function with explicit return type
  const getQuadrant = (
    payout: number,
    demand: number
  ): keyof typeof QUADRANTS => {
    const isHighPayout = payout / maxPayout > 0.5;
    const isHighDemand = demand > 50;

    if (isHighPayout && isHighDemand) return "STRATEGIC_PICKS";
    if (isHighPayout && !isHighDemand) return "HIDDEN_GEMS";
    if (!isHighPayout && isHighDemand) return "HOT_STREAKS";
    return "SIDE_QUESTS";
  };

  return (
    <TooltipProvider>
      <div className="relative aspect-[4/3] w-full border rounded-lg p-12 bg-card">
        <div className="absolute top-1/2 -left-10 -translate-y-1/2 -rotate-90 font-semibold text-muted-foreground">
          Payout Amount →
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-semibold text-muted-foreground">
          Content Demand →
        </div>
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
          {Object.entries(QUADRANTS).map(([key, quad]) => {
            const relevantAssignments = assignments.filter(
              (a) => getQuadrant(a.payout_amount, a.demand_score) === key
            );

            return (
              <div
                key={key}
                className={`relative rounded-md border ${quad.className}`}
              >
                <div className="absolute top-2 left-3">
                  <h4 className="font-bold text-sm md:text-base">
                    {quad.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {quad.description}
                  </p>
                </div>
                {relevantAssignments.map((a) => {
                  const y = (a.payout_amount / maxPayout) * 100;
                  const x = a.demand_score;

                  return (
                    <Tooltip key={a.id}>
                      <TooltipTrigger asChild>
                        <a
                          href={`/dashboard/contributor/assignments/${a.id}`}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-150"
                          style={{
                            bottom: y > 50 ? `${y / 2 + 48}%` : `${y}%`,
                            left: x > 50 ? `${x / 2 + 48}%` : `${x / 2}%`,
                          }}
                        >
                          <StarIcon className="h-4 w-4 text-primary fill-primary" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="p-1">
                          <p className="font-bold">{a.title}</p>
                          <p>Payout: ${a.payout_amount}</p>
                          <p>Demand: {a.demand_score}/100</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {a.categories?.map((c) => (
                              <Badge key={c.id} variant="secondary">
                                {c.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
