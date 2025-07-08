// src/components/TrendingReviews.tsx
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

interface Business {
  name: string;
  slug: string;
  revuoo_score: number | null;
}

interface Review {
  id: string;
  summary: string;
  category: string;
  businesses: Business | Business[];
}

export default async function TrendingReviews() {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`id, summary, category, businesses (name, revuoo_score, slug)`)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching trending reviews:", error.message || error);
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className="bg-gray-50 py-24 sm:py-32 text-center">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Be the First to Review!
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            There are no approved reviews yet. Write a review to get the
            conversation started.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="trending-heading"
      className="bg-gray-50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="trending-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            What’s Trending on Revuoo
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See what services and products are getting noticed. Here are some of
            the latest high-quality reviews from our community and experts.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {reviews.map((review) => {
            const business = Array.isArray(review.businesses)
              ? review.businesses[0]
              : review.businesses;

            if (!business?.slug) return null;

            return (
              <article key={review.id}>
                <Link
                  href={`/business/${business.slug}`}
                  className="block h-full"
                  aria-label={`Read review for ${business.name}`}
                >
                  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-semibold">
                          {business.name || "Unknown Business"}
                        </CardTitle>
                        {business.revuoo_score !== null && (
                          <Badge className="bg-indigo-600 text-white">
                            {Number(business.revuoo_score).toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 pt-1">
                        {review.category}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700 line-clamp-4">
                        {review.summary || "No summary available."}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm font-semibold text-indigo-600">
                        Read full review <span aria-hidden="true">→</span>
                      </p>
                    </CardFooter>
                  </Card>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
