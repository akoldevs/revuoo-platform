// src/app/reviews/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

// This tells Next.js to re-fetch the data on every request
export const dynamic = 'force-dynamic'

// The page now receives 'params' which contains the dynamic parts of the URL
export default async function SingleReviewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // We fetch only the single review that matches the 'id' from the URL
  const { data: review } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', params.id)
    .single()

  // If no review is found for that id, show the 404 page
  if (!review) {
    notFound()
  }

  // A helper array to make displaying the ratings easier
  const aspectRatings = [
    { label: 'Overall Rating', value: review.overall_rating },
    { label: 'Quality of Cleaning', value: review.quality },
    { label: 'Staff Professionalism', value: review.professionalism },
    { label: 'Punctuality & Reliability', value: review.punctuality },
    { label: 'Booking & Communication', value: review.communication },
    { label: 'Value for Money', value: review.value },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      {/* Review Header */}
      <div className="border-b pb-6 mb-6">
        <p className="text-sm font-semibold text-indigo-600 mb-2">{review.category}</p>
        <h1 className="text-4xl font-extrabold tracking-tight">{review.title}</h1>
        {review.service_date && (
  <p className="text-sm text-gray-500 mt-2">
    Service on: {new Date(review.service_date).toLocaleDateString()}
  </p>
)}
      </div>

      {/* Main Review Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Full Review</h2>
          <div className="prose max-w-none">
            <p>{review.summary}</p>
          </div>
        </div>

        {/* Ratings Breakdown Sidebar */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4 text-center">Score Breakdown</h2>
          <div className="space-y-4">
            {aspectRatings.map(aspect => (
              <div key={aspect.label}>
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-sm font-medium">{aspect.label}</p>
                  <p className="text-sm font-bold">{aspect.value} / 5</p>
                </div>
                {/* A simple progress bar to visualize the score */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${(aspect.value || 0) * 20}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}