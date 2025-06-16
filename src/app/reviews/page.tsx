// src/app/reviews/page.tsx
import { createClient } from '@/lib/supabase/server';
import ReviewCard from '@/components/ReviewCard';
import { cookies } from 'next/headers';

export default async function ReviewsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*');

  if (error) {
    console.error('Error fetching reviews:', error);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Explore All Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}