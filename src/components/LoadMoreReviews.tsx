// src/components/LoadMoreReviews.tsx
'use client'

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import ReviewCard from './ReviewCard'; // We will reuse our existing card
import { fetchMoreReviews } from '@/app/reviews/actions'; // We will create this action next

// Define the shape of the review data
type Review = {
  id: number;
  title: string;
  summary: string;
  overall_rating: number | null;
  businesses: {
    name: string;
    slug: string;
  } | null;
};

export default function LoadMoreReviews({
  initialReviews,
  sortOrder,
}: {
  initialReviews: Review[];
  sortOrder: string;
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const newReviews = await fetchMoreReviews(nextPage, sortOrder);

    if (newReviews.length > 0) {
      setPage(nextPage);
      setReviews((prevReviews) => [...prevReviews, ...newReviews]);
    } else {
      setHasMore(false); // No more reviews to load
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review as any} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button onClick={loadMore} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Load More'}
          </Button>
        </div>
      )}
    </>
  );
}