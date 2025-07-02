// src/app/dashboard/my-reviews/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';

export async function deleteReview(formData: FormData) {
  // ... (this function remains unchanged)
  const supabase = createClient();
  const reviewId = formData.get('reviewId') as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: review, error: fetchError } = await supabase
    .from('reviews')
    .select('id, author_id')
    .eq('id', reviewId)
    .single();

  if (fetchError || !review) {
    throw new Error("Review not found.");
  }

  if (review.author_id !== user.id) {
    throw new Error("You are not authorized to delete this review.");
  }
  
  const { error: deleteError } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (deleteError) {
    console.error("Error deleting review:", deleteError);
    throw new Error("Could not delete review.");
  }
  
  revalidatePath('/dashboard/my-reviews');
}


// --- NEW FUNCTION TO UPDATE THE REVIEW ---
export async function updateReview(formData: FormData) {
  const supabase = createClient();
  const reviewId = formData.get('reviewId') as string;

  // 1. Get the current user and perform security check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id, author_id')
    .eq('id', reviewId)
    .single();

  if (!existingReview || existingReview.author_id !== user.id) {
    throw new Error("You are not authorized to edit this review.");
  }

  // 2. Extract and prepare the updated data
  const rawFormData = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    service_date: formData.get('service_date'),
    quality: formData.get('quality'),
    professionalism: formData.get('professionalism'),
    punctuality: formData.get('punctuality'),
    communication: formData.get('communication'),
    value: formData.get('value'),
  };

  const qualityRating = Number(rawFormData.quality);
  const overall_rating = (
    qualityRating +
    Number(rawFormData.professionalism) +
    Number(rawFormData.punctuality) +
    Number(rawFormData.communication) +
    Number(rawFormData.value)
  ) / 5;

  const updatedData = {
    title: String(rawFormData.title),
    summary: String(rawFormData.summary),
    service_date: rawFormData.service_date ? String(rawFormData.service_date) : null,
    status: 'pending', // IMPORTANT: Reset status to pending for re-moderation
    quality: qualityRating,
    professionalism: Number(rawFormData.professionalism),
    punctuality: Number(rawFormData.punctuality),
    communication: Number(rawFormData.communication),
    value: Number(rawFormData.value),
    overall_rating: overall_rating,
  };

  // 3. Update the review in the database
  const { error } = await supabase
    .from('reviews')
    .update(updatedData)
    .eq('id', reviewId);

  if (error) {
    console.error('Error updating review:', error);
    throw new Error('Could not update review.');
  }

  // 4. On success, revalidate paths and redirect back to the dashboard
  revalidatePath('/dashboard/my-reviews');
  revalidatePath(`/reviews/${reviewId}`); // Revalidate the single review page
  redirect('/dashboard/my-reviews');
}