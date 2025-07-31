// src/app/dashboard/my-reviews/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardReviewCard from "@/components/dashboard/DashboardReviewCard"; // Import our new component

export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?message=You must be logged in to view this page.");
  }

  // The data we fetch is slightly different to match the card component's needs
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      `
            id, created_at, title, status,
            businesses ( name, slug )
        `
    )
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user's reviews:", error);
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Reviews</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage all the reviews you&apos;ve submitted.
          </p>
        </div>
        <Button asChild>
          <Link href="/write-a-review">Write a New Review</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          // The map is now much cleaner!
          reviews.map((review) => (
            <DashboardReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-semibold">
              You haven&apos;t written any reviews yet.
            </h3>
            <p className="text-gray-600 mt-2 mb-4">
              Share your experience to help the community.
            </p>
            <Button asChild>
              <Link href="/write-a-review">Write Your First Review</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
