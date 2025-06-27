// src/app/dashboard/my-reviews/edit/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditReviewForm from './EditReviewForm' // <-- Import our new form

export const dynamic = 'force-dynamic'

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: review } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', params.id)
    .eq('author_id', user.id)
    .single()

  if (!review) {
    notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Your Review</h1>
      {/* We now render the form, passing the review data to it */}
      <EditReviewForm review={review} />
    </div>
  )
}