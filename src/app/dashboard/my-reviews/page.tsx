// src/app/dashboard/my-reviews/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteReview } from './actions' // <-- 1. Import our new action

export const dynamic = 'force-dynamic'

export default async function MyReviewsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=You must be logged in to view your reviews')
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
      <p className="text-gray-600 mb-8">Manage all the reviews you've submitted.</p>

      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">{review.title}</h3>
                <p className="text-sm text-gray-500">
                  Submitted on {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-4">
                {/* The Edit button is not functional yet */}
                <Link href={`/dashboard/my-reviews/edit/${review.id}`} className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md">
                    Edit
                </Link>

                {/* 2. Wrap the Delete button in a form that calls our action */}
                <form action={deleteReview}>
                  {/* 3. Add a hidden input to pass the review's ID */}
                  <input type="hidden" name="reviewId" value={review.id} />
                  <button type="submit" className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md">
                    Delete
                  </button>
                </form>

              </div>
            </div>
          ))
        ) : (
          <p>You haven't written any reviews yet.</p>
        )}
      </div>
    </div>
  )
}