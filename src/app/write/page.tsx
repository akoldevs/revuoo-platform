// src/app/write/page.tsx
import WriteReviewForm from './WriteReviewForm'

export default function WriteReviewPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Write a New Review</h1>
      <WriteReviewForm />
    </div>
  )
}