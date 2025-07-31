// src/app/dashboard/contributor/content/revise/[reviewId]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SubmissionForm } from "@/components/contributor/SubmissionForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// This type defines the shape of the data we fetch for the rejected review.
type RejectedReviewData = {
  id: string;
  assignment_id: number;
  title: string;
  summary: string | null;
  body_content: Record<string, unknown>;
  rating_overall: number;
  rating_pros: string[];
  rating_cons: string[];
  moderator_notes: string | null;
  // Added fields needed for security checks
  contributor_id: string;
  status: string;
};

export default async function ReviseContentPage({
  params,
}: {
  params: { reviewId: string };
}) {
  const supabase = await createClient();
  const reviewId = params.reviewId;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Fetch the specific review and apply our specific type.
  const { data: review, error } = await supabase
    .from("expert_reviews")
    .select(
      "id, assignment_id, title, summary, body_content, rating_overall, rating_pros, rating_cons, contributor_id, status, moderator_notes"
    )
    .eq("id", reviewId)
    .single<RejectedReviewData>();

  // Security Checks:
  if (
    error ||
    !review ||
    review.contributor_id !== user.id ||
    review.status !== "rejected"
  ) {
    return notFound();
  }

  // FIX: Constructed a new object for initialData that strictly matches the
  // expected prop type of the SubmissionForm. This avoids spreading an
  // incompatible object and resolves the type error.
  const initialData = {
    title: review.title,
    // Coalesce null to undefined to satisfy the component's prop type.
    summary: review.summary ?? undefined,
    bodyContent: JSON.stringify(review.body_content),
    ratingPros: review.rating_pros.join(", "),
    ratingCons: review.rating_cons.join(", "),
    ratingOverall: review.rating_overall,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Revising your submission for:
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{review.title}</h1>
      </div>

      {/* Display the moderator's feedback prominently */}
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Editor Feedback</AlertTitle>
        <AlertDescription>
          {review.moderator_notes || "No specific feedback was provided."}
        </AlertDescription>
      </Alert>

      {/* Pass the reviewId and initialData to the form */}
      <SubmissionForm
        reviewId={review.id}
        assignmentId={review.assignment_id}
        initialData={initialData}
      />
    </div>
  );
}
