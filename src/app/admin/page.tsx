// src/app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { approveReview, rejectReview } from './actions'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    notFound()
  }

  // Fetch all reviews with the 'pending' status
  const { data: pendingReviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true }) // Show oldest first

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-lg text-gray-600">Content Moderation Queue</p>

      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold">Pending Reviews ({pendingReviews?.length || 0})</h2>
        {pendingReviews && pendingReviews.length > 0 ? (
          pendingReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
              <h3 className="font-bold text-xl">{review.title}</h3>
              <p className="text-sm text-gray-500 mb-3">
                Submitted on {new Date(review.created_at).toLocaleDateString()}
              </p>
              <p className="italic bg-white p-3 rounded-md">{review.summary}</p>
              <div className="flex gap-4 mt-4">
                <form action={approveReview}>
                  <input type="hidden" name="reviewId" value={review.id} />
                  <Button type="submit" variant="default" size="sm">Approve</Button>
                </form>
                <form action={rejectReview}>
                  <input type="hidden" name="reviewId" value={review.id} />
                  <Button type="submit" variant="destructive" size="sm">Reject</Button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No pending reviews. Great job!</p>
        )}
      </div>
    </div>
  )
}