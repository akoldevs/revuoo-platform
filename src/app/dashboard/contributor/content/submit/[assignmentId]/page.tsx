// src/app/dashboard/contributor/content/submit/[assignmentId]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SubmissionForm } from "@/components/contributor/SubmissionForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function SubmitContentPage({
  params,
}: {
  params: { assignmentId: string };
}) {
  const supabase = await createClient();
  const assignmentId = Number(params.assignmentId);

  if (!assignmentId || Number.isNaN(assignmentId)) {
    return notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return notFound();
  }

  const { data: assignment, error } = await supabase
    .from("assignments")
    .select("id, title, status, contributor_id")
    .eq("id", assignmentId)
    .single();

  // Security check: Ensure the user owns this assignment
  if (error || !assignment || assignment.contributor_id !== user.id) {
    return notFound();
  }

  // Check if the assignment has already been submitted
  if (assignment.status === "submitted" || assignment.status === "completed") {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 rounded-lg border bg-card text-card-foreground p-8">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h1 className="text-2xl font-bold tracking-tight">
          Submission Already Received
        </h1>
        <p className="text-muted-foreground max-w-md">
          You have already submitted your review for &quot;{assignment.title}
          &quot;. It is now being processed by our editorial team.
        </p>
        <Button asChild>
          <Link href="/dashboard/contributor/content">View My Content</Link>
        </Button>
      </div>
    );
  }

  // ✅ FIXED: Security check now correctly looks for the 'in_progress' status.
  if (assignment.status !== "in_progress") {
    return notFound(); // Or a more specific error page
  }

  // If all checks pass, show the submission form
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Submitting work for:</p>
        <h1 className="text-2xl font-bold tracking-tight">
          {assignment.title}
        </h1>
      </div>
      <SubmissionForm assignmentId={assignment.id} />
    </div>
  );
}
