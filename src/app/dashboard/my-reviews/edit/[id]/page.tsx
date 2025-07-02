// src/app/dashboard/my-reviews/edit/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import EditReviewForm from './EditReviewForm'; // We will create this next

// This function securely fetches the review data, ensuring ownership
async function getReviewForEdit(reviewId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: review } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .eq('author_id', user.id) // SECURITY: Ensures user owns the review
    .single();

  return review;
}

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const review = await getReviewForEdit(params.id);

  // If no review is found (or user doesn't own it), show a 404 page
  if (!review) {
    notFound();
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="w-full max-w-3xl mx-auto px-6">
        {/* We pass the fetched review data to the form component */}
        <EditReviewForm review={review} />
      </div>
    </div>
  );
}