// src/app/dashboard/business/reviews/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BusinessReviewItem from "@/components/dashboard/business/BusinessReviewItem";
import ReviewFilters from "@/components/dashboard/business/ReviewFilters";

// Define a clear type for our Review data
type ReviewWithResponse = {
  id: string;
  title: string;
  summary: string;
  created_at: string;
  overall_rating: number;
  author_id?: string;
  business_responses: {
    response_text: string;
  }[];
};

export const dynamic = "force-dynamic";

export default async function ManageReviewsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=You must be logged in to view this page.");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return redirect("/for-businesses");
  }

  const sortOrder = (searchParams.sort as string) || "newest";
  const ratingFilter = searchParams.rating as string;

  let query = supabase
    .from("reviews")
    .select(
      `id, title, summary, created_at, overall_rating, author_id, business_responses(response_text)`
    )
    .eq("business_id", business.id)
    .eq("status", "approved");

  if (ratingFilter && ratingFilter !== "all") {
    query = query.eq("overall_rating", Number(ratingFilter));
  }

  switch (sortOrder) {
    case "highest_rated":
      query = query.order("overall_rating", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    case "lowest_rated":
      query = query.order("overall_rating", {
        ascending: true,
        nullsFirst: true,
      });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    default: // newest
      query = query.order("created_at", { ascending: false });
  }

  const { data: reviews, error } = await query;

  if (error) {
    console.error("Error fetching business reviews:", error);
  }

  return (
    <div className="w-full">
      <div className="border-b pb-6 mb-8">
        <h1 className="text-4xl font-bold">Manage Reviews</h1>
        <p className="mt-2 text-lg text-gray-600">
          Respond to customer feedback for {business.name}
        </p>
      </div>

      <ReviewFilters />

      <div className="space-y-8">
        {reviews && reviews.length > 0 ? (
          (reviews as ReviewWithResponse[]).map((review) => (
            <BusinessReviewItem
              key={review.id}
              review={review}
              businessId={business.id}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border">
            <h3 className="text-xl font-semibold">No Reviews Found</h3>
            <p className="text-gray-600 mt-2">
              No reviews match your current filter selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
