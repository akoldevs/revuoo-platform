// src/app/reviews/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server';

const PAGE_SIZE = 9;

export async function fetchMoreReviews(page: number, sortOrder: string) {
  const supabase = await createClient(); // <-- The missing await is added here
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('reviews')
    .select(`id, title, summary, overall_rating, businesses ( name, slug )`)
    .eq('status', 'approved')
    .range(from, to);

  if (sortOrder === 'highest_rated') {
    query = query.order('overall_rating', { ascending: false, nullsFirst: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: reviews, error } = await query;
  
  if (error) {
    console.error("Error fetching more reviews:", error);
    return [];
  }

  return reviews;
}