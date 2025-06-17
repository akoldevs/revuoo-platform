// src/app/reviews/page.tsx
import { createClient } from '@/lib/supabase/server';
import ReviewCard from '@/components/ReviewCard';

// This page is now an async Server Component
export default async function ReviewsPage() {
  const supabase = createClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*');

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Explore All Reviews</h1>

      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p>No reviews found. Be the first to write one!</p>
      )}
    </div>
  );
}