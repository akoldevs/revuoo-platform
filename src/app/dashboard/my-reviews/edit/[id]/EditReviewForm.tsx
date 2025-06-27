// src/app/dashboard/my-reviews/edit/[id]/EditReviewForm.tsx
'use client'

import { updateReview } from '../../actions'

// This form will receive the review data as a prop
export default function EditReviewForm({ review }: { review: any }) {

  return (
    <form action={updateReview} className="space-y-6">
      {/* We need a hidden input to pass the review's ID to the action */}
      <input type="hidden" name="reviewId" value={review.id} />

      <div>
        <label htmlFor="title" className="block text-sm font-medium">Review Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          // Pre-fill the form with existing data
          defaultValue={review.title}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium">Summary / Body</label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={6}
          // Pre-fill the form with existing data
          defaultValue={review.summary || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="serviceDate" className="block text-sm font-medium">Date of Service</label>
        <input
          id="serviceDate"
          name="serviceDate"
          type="date"
          required
          // Pre-fill the form with existing data
          defaultValue={review.service_date}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <hr />

      <h2 className="text-xl font-semibold">Aspect Ratings (1-5)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Overall Rating', name: 'overallRating', value: review.overall_rating },
          { label: 'Quality of Cleaning', name: 'quality', value: review.quality },
          { label: 'Staff Professionalism', name: 'professionalism', value: review.professionalism },
          { label: 'Punctuality & Reliability', name: 'punctuality', value: review.punctuality },
          { label: 'Booking & Communication', name: 'communication', value: review.communication },
          { label: 'Value for Money', name: 'value', value: review.value },
        ].map(aspect => (
          <div key={aspect.name}>
            <label className="block text-sm font-medium">{aspect.label}</label>
            <input
              name={aspect.name}
              type="number" min="1" max="5" step="0.5"
              required
              // Pre-fill the form with existing data
              defaultValue={aspect.value || 3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        ))}
      </div>

      <hr />

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Update Review
      </button>
    </form>
  )
}