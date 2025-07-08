// src/components/LoadMoreReviews.tsx
'use client'

import { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { fetchMoreReviews } from '@/app/reviews/actions';
import { Review } from '@/lib/types';

export default function LoadMoreReviews({
  initialReviews,
  sortOrder,
}: {
  initialReviews: Review[];
  sortOrder: string;
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialReviews.length > 0);
  const [isLoading, setIsLoading] = useState(false);

  // --- 2. THIS IS THE FIX ---
  // This useEffect hook will run whenever the initialReviews prop changes.
  // This happens after a router.refresh(), ensuring our client state
  // is always in sync with the latest server data.
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const loadMore = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const newReviews = await fetchMoreReviews(nextPage, sortOrder);

    if (newReviews.length > 0) {
      setPage(nextPage);
      setReviews((prevReviews) => [...prevReviews, ...newReviews]);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
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