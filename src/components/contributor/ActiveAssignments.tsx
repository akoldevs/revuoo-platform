// src/components/contributor/ActiveAssignments.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define a specific type for an assignment object to replace 'any'.
// This ensures type safety and provides better autocompletion.
interface Assignment {
  id: string | number;
  title: string;
  updated_at: string;
}

export default function ActiveAssignments({
  assignments,
}: {
  // FIX: Replaced 'any[]' with the specific 'Assignment[]' type.
  assignments: Assignment[];
}) {
  return (
    <div className="mt-8 bg-card p-6 rounded-lg border">
      <h2 className="text-xl font-semibold text-card-foreground">
        My Active Assignments
      </h2>
      {assignments && assignments.length > 0 ? (
        <div className="mt-4 space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-card-foreground">
                  {assignment.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Claimed on:{" "}
                  {new Date(assignment.updated_at).toLocaleDateString()}
                </p>
              </div>
              <Button asChild>
                <Link
                  href={`/dashboard/contributor/content/submit/${assignment.id}`}
                >
                  Submit Work
                </Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-muted-foreground">
          You have no active assignments. Claim one from the marketplace!
        </p>
      )}
    </div>
  );
}
