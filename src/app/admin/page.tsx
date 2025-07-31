// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  approveExpertReview,
  approveReview,
  approveResponse,
  rejectResponse,
  rejectReview,
} from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Bot,
  Star,
  Loader2,
  CheckCircle,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { RejectWithFeedbackModal } from "@/components/admin/RejectWithFeedbackModal";
import { Toaster } from "@/components/ui/sonner";

// This type now perfectly matches the data returned by our database function
type UnifiedReview = {
  id: string;
  review_type: "user" | "expert";
  title: string;
  summary: string;
  created_at: string;
  business_name: string | null;
  author_name: string | null;
  business_is_verified: boolean;
  contributor_total_approved_reviews: number;
  priority_score: number;
  ai_safety_rating: string | null;
  ai_reasoning: string | null;
};

type PendingResponseFromDB = {
  id: string;
  response_text: string;
  created_at: string;
  businesses: { name: string }[] | null;
  reviews: { title: string }[] | null;
};

const getSafetyBadgeVariant = (
  status: string | null | undefined
): "default" | "destructive" | "secondary" => {
  switch (status) {
    case "SAFE":
      return "default";
    case "FLAGGED":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function AdminPage() {
  const [allPendingItems, setAllPendingItems] = useState<UnifiedReview[]>([]);
  const [pendingResponses, setPendingResponses] = useState<
    PendingResponseFromDB[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<UnifiedReview | null>(
    null
  );

  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();

    // ✅ FIX: We now make a single, simple call to our powerful database function
    const [reviewsRes, responsesRes] = await Promise.all([
      supabase.rpc("get_pending_reviews_for_admin"),
      supabase
        .from("business_responses")
        .select(
          `id, response_text, created_at, businesses(name), reviews(title)`
        )
        .eq("status", "pending"),
    ]);

    // Sort the unified list by the pre-calculated priority score
    const sortedReviews = (reviewsRes.data || []).sort(
      (a: UnifiedReview, b: UnifiedReview) =>
        b.priority_score - a.priority_score
    );

    setAllPendingItems(sortedReviews);
    setPendingResponses(responsesRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenRejectModal = (review: UnifiedReview) => {
    setSelectedReview(review);
    setIsRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedReview(null);
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-4 text-lg">Loading Moderation Queue...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />
      <RejectWithFeedbackModal
        isOpen={isRejectModalOpen}
        onClose={handleCloseRejectModal}
        reviewId={selectedReview?.id || null}
        reviewTitle={selectedReview?.title || null}
      />
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            AI-Powered Priority Queue
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            Pending Reviews ({allPendingItems.length})
          </h2>
          {allPendingItems.length > 0 ? (
            allPendingItems.map((review) => {
              const isHighPriority = review.priority_score > 100;
              return (
                <Card
                  key={`review-${review.id}`}
                  className={`bg-card border-l-4 ${
                    isHighPriority ? "border-red-500" : "border-yellow-400"
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{review.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        {isHighPriority && (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            HIGH PRIORITY
                          </Badge>
                        )}
                        <Badge
                          variant={
                            review.review_type === "expert"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {review.review_type === "expert" && (
                            <Star className="mr-1 h-3 w-3" />
                          )}
                          {review.review_type === "expert"
                            ? "EXPERT REVIEW"
                            : "USER REVIEW"}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      For Business:{" "}
                      <span className="font-bold text-primary">
                        {review.business_name}
                      </span>
                      <br />
                      By:{" "}
                      <span className="font-semibold">
                        {review.author_name}
                      </span>{" "}
                      on {format(new Date(review.created_at), "MMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 p-4 rounded-lg bg-muted/50 border flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <div className="font-semibold text-muted-foreground">
                        Context Signals:
                      </div>
                      {review.review_type === "expert" && (
                        <div
                          className="flex items-center gap-2"
                          title="Total Approved Reviews by Contributor"
                        >
                          <span className="font-medium">
                            {review.contributor_total_approved_reviews}
                          </span>
                          <span className="text-muted-foreground">
                            Approved Reviews
                          </span>
                        </div>
                      )}
                      <div
                        className="flex items-center gap-2"
                        title="Business Verification Status"
                      >
                        {review.business_is_verified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 text-yellow-500" />
                        )}
                        <span
                          className={
                            review.business_is_verified
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {review.business_is_verified
                            ? "Verified Business"
                            : "Unverified"}
                        </span>
                      </div>
                    </div>
                    <p className="italic bg-muted p-4 rounded-md mb-6">
                      {review.summary}
                    </p>
                    {review.review_type === "user" &&
                      review.ai_safety_rating && (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-3 flex items-center text-lg">
                            <Bot className="mr-2 h-5 w-5 text-muted-foreground" />{" "}
                            AI-Assisted Moderation
                          </h4>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3 text-sm">
                            <div>
                              <span className="font-semibold">Safety: </span>
                              <Badge
                                variant={getSafetyBadgeVariant(
                                  review.ai_safety_rating
                                )}
                              >
                                {review.ai_safety_rating || "N/A"}
                              </Badge>
                            </div>
                            <p>
                              <span className="font-semibold">Reasoning:</span>{" "}
                              {review.ai_reasoning || (
                                <span className="italic text-muted-foreground">
                                  No specific reasoning provided by AI.
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                  </CardContent>
                  <CardFooter className="flex gap-4 border-t pt-4 mt-4">
                    <form
                      action={
                        review.review_type === "expert"
                          ? approveExpertReview
                          : approveReview
                      }
                    >
                      <input type="hidden" name="reviewId" value={review.id} />
                      <Button type="submit" variant="default" size="sm">
                        Approve
                      </Button>
                    </form>
                    {review.review_type === "expert" ? (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenRejectModal(review)}
                      >
                        Reject
                      </Button>
                    ) : (
                      <form action={rejectReview}>
                        <input
                          type="hidden"
                          name="reviewId"
                          value={review.id}
                        />
                        <Button type="submit" variant="destructive" size="sm">
                          Reject
                        </Button>
                      </form>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <p className="text-muted-foreground py-10 text-center">
              No pending reviews to moderate. Great job!
            </p>
          )}
        </div>

        <div className="mt-12 pt-8 border-t space-y-6">
          <h2 className="text-2xl font-semibold">
            Pending Business Responses ({pendingResponses.length})
          </h2>
          {pendingResponses.length > 0 ? (
            pendingResponses.map((response) => (
              <Card
                key={`response-${response.id}`}
                className="bg-card border-l-4 border-blue-400"
              >
                <CardHeader>
                  <CardTitle>
                    Response to: &quot;
                    {response.reviews?.[0]?.title || "a review"}&quot;
                  </CardTitle>
                  <CardDescription>
                    For Business:{" "}
                    <span className="font-bold text-primary">
                      {response.businesses?.[0]?.name || "Unknown Business"}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="italic bg-muted p-4 rounded-md">
                    {response.response_text}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <form action={approveResponse}>
                    <input
                      type="hidden"
                      name="responseId"
                      value={response.id}
                    />
                    <Button type="submit" variant="default" size="sm">
                      Approve Response
                    </Button>
                  </form>
                  <form action={rejectResponse}>
                    <input
                      type="hidden"
                      name="responseId"
                      value={response.id}
                    />
                    <Button type="submit" variant="destructive" size="sm">
                      Reject Response
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground py-10 text-center">
              No pending business responses.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
