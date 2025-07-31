// src/components/dashboard/DashboardReviewCard.tsx
// This now contains your excellent UI and features

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteReview } from "@/app/dashboard/my-reviews/actions"; // We'll import the action here

// The type for a single review object
interface Review {
  id: number;
  created_at: string;
  title: string;
  status: string;
  businesses: {
    name: string;
    slug: string;
  } | null;
}

// Helper function to get the correct color for the status badge
const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "approved":
      return "default"; // This will be the shadcn default color (likely dark blue/black)
    case "pending":
      return "secondary"; // This will be a gray color
    case "rejected":
      return "destructive"; // This will be red
    default:
      return "outline";
  }
};

export default function DashboardReviewCard({ review }: { review: Review }) {
  const business = review.businesses;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
          <div>
            <CardTitle className="text-xl">{review.title}</CardTitle>
            {business && (
              <CardDescription className="pt-1">
                For:{" "}
                <Link
                  href={`/business/${business.slug}`}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  {business.name}
                </Link>
              </CardDescription>
            )}
          </div>
          <Badge variant={getStatusVariant(review.status)} className="w-fit">
            {review.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-sm text-gray-500">
          Submitted on {format(new Date(review.created_at), "MMM d, yyyy")}
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 sm:flex-none"
          >
            <Link href={`/dashboard/my-reviews/edit/${review.id}`}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Link>
          </Button>
          <form action={deleteReview} className="flex-1 sm:flex-none">
            <input type="hidden" name="reviewId" value={review.id} />
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
