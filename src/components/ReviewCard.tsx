// src/components/ReviewCard.tsx
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface Review {
  id: number;
  title: string;
  category: string | null;
  overall_rating: number | null;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/reviews/${review.id}`} legacyBehavior>
      <Card className="h-full hover:border-black transition-all">
        <CardHeader>
          <CardTitle>{review.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {review.category && (
            <p className="text-sm text-gray-600">Category: {review.category}</p>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center">
            {review.overall_rating && (
              <>
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-xs text-gray-500 ml-2">({review.overall_rating})</span>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}