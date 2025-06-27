// src/app/reviews/page.tsx

export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import ReviewCard from '@/components/ReviewCard'

export default async function ReviewsPage() {
  const supabase = await createClient()
  
  // We add .eq('status', 'approved') to only fetch approved reviews
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved') 

  if (error) {
    console.error('Error fetching reviews:', error.message)
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold mb-8">Explore All Reviews</h1>
        <p className="text-red-500">Sorry, we couldn't load the reviews at this time.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Explore All Reviews</h1>

      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review as any} />
          ))}
        </div>
      ) : (
        <p>No approved reviews have been written yet. Be the first!</p>
      )}
    </div>
  )
}