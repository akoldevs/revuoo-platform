// src/app/reviews/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function fetchMoreReviews(page: number, sortOrder: string) {
  const supabase = await createClient();
  const from = (page - 1) * 9;
  const to = from + 9 - 1;

  let query = supabase.from('reviews').select(`*, businesses ( name, slug )`).eq('status', 'approved').range(from, to);

  if (sortOrder === 'highest_rated') {
    query = query.order('overall_rating', { ascending: false, nullsFirst: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: reviews, error } = await query;
  if (error) { console.error("Error fetching more reviews:", error); return []; }
  return reviews;
}

export async function handleVote(formData: FormData) {
  const supabase = await createClient();
  const reviewId = formData.get('reviewId');
  const voteType = formData.get('voteType');
  const pathname = formData.get('pathname') as string;

  if (!reviewId || !voteType || !pathname) {
    throw new Error('Missing required form data for voting.');
  }

  const { error } = await supabase.rpc('handle_review_vote', {
    p_review_id: Number(reviewId),
    p_vote_type: String(voteType),
  });

  if (error) {
    console.error('Error handling vote:', error);
    return;
  }

  // Revalidate the specific path the user was on. This is the fix.
  revalidatePath(pathname);
}