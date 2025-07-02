// src/components/ReviewCard.tsx
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';

// Define the shape of the data this card expects
// This includes the nested business information
type ReviewCardProps = {
  review: {
    id: number;
    title: string;
    summary: string;
    overall_rating: number | null;
    businesses: {
      name: string;
      slug: string;
    } | null;
  };
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const business = review.businesses;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{review.title}</CardTitle>
        {/* We display the business name here */}
        <CardDescription>
          Review for: <Link href={`/business/${business?.slug}`} className="font-bold text-indigo-600 hover:underline">{business?.name || 'Unknown Business'}</Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-700 line-clamp-4">{review.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {/* Link to the full, detailed single review page */}
        <Link href={`/business/${business?.slug}`} className="text-sm font-semibold text-indigo-600">
          Read full review <span aria-hidden="true">→</span>
        </Link>
        {review.overall_rating && (
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-bold">
            <Star className="h-4 w-4"/>
            <span>{review.overall_rating.toFixed(1)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}