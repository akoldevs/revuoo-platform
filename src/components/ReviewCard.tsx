// src/components/ReviewCard.tsx
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { Review } from '@/lib/types';
import VoteButtons from './VoteButtons'; // <-- Import our new component

export default function ReviewCard({ review }: { review: Review }) {
  const business = review.businesses;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{review.title}</CardTitle>
        {business && (
            <CardDescription>
              Review for: <Link href={`/business/${business.slug}`} className="font-bold text-indigo-600 hover:underline">{business.name}</Link>
            </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-700 line-clamp-4">{review.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 p-3">
        {/* VOTE BUTTONS ARE HERE */}
        <VoteButtons review={review} />

        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-bold">
          <Star className="h-4 w-4"/>
          <span>{review.overall_rating?.toFixed(1) || 'N/A'}</span>
        </div>
      </CardFooter>
    </Card>
  );
}