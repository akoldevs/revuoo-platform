// src/components/dashboard/RecentReviews.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Star } from "lucide-react";

// Define the type for the reviews this component expects
interface Review {
  id: number;
  title: string;
  overall_rating: number | null;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export default function RecentReviews({ reviews }: { reviews: Review[] }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Reviews</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/business/reviews">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="flex items-start gap-4">
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{review.title}</p>
                  <p className="text-sm text-gray-500">
                    by {review.profiles?.full_name || "Anonymous"} on{" "}
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                {review.overall_rating && (
                  <div className="flex-shrink-0 flex items-center gap-1 text-sm font-bold">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{review.overall_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 py-8 text-center">
              No recent reviews to display.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
