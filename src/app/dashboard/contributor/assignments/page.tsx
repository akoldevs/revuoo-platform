// src/app/dashboard/contributor/assignments/page.tsx

import ContentOpportunityMatrix from "@/components/contributor/ContentOpportunityMatrix";
import { Suspense } from "react";

export const metadata = {
  title: "Assignments | Revuoo",
  description: "Find and claim new writing opportunities.",
};

export default function ContributorAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Content Opportunity Matrix
        </h1>
        <p className="text-muted-foreground">
          Find your next assignment. Strategic Picks in the top-right are the
          most valuable.
        </p>
      </div>

      <Suspense fallback={<MatrixSkeleton />}>
        <ContentOpportunityMatrix />
      </Suspense>
    </div>
  );
}

// A simple loading skeleton to improve user experience
function MatrixSkeleton() {
  return (
    <div className="relative aspect-[4/3] w-full animate-pulse border rounded-lg bg-card p-12">
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
        <div className="rounded-md bg-muted/50"></div>
        <div className="rounded-md bg-muted/50"></div>
        <div className="rounded-md bg-muted/50"></div>
        <div className="rounded-md bg-muted/50"></div>
      </div>
    </div>
  );
}
