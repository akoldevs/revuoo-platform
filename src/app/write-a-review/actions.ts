// src/app/write-a-review/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function searchBusinesses(query: string) {
  if (!query) {
    return [];
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, slug')
    .ilike('name', `%${query}%`)
    .limit(5);

  if (error) {
    console.error('Error searching businesses:', error);
    return [];
  }
  return data;
}

// --- NEW FUNCTION TO SUBMIT THE REVIEW ---
export async function submitReview(formData: FormData) {
  const supabase = await createClient();

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You must be logged in to write a review.');
  }

  // 2. Extract data from the form
  const businessId = formData.get('businessId');
  const title = formData.get('title');
  const summary = formData.get('summary');
  const serviceDate = formData.get('service_date');
  
  const quality = Number(formData.get('quality'));
  const professionalism = Number(formData.get('professionalism'));
  const punctuality = Number(formData.get('punctuality'));
  const communication = Number(formData.get('communication'));
  const value = Number(formData.get('value'));

  // 3. Basic Validation
  if (!businessId || !title || !summary || !quality || !professionalism || !punctuality || !communication || !value) {
    throw new Error('Please fill out all required fields.');
  }

  // Calculate the average for overall_rating
  const overall_rating = (quality + professionalism + punctuality + communication + value) / 5;
  
  // 4. Prepare the data for Supabase
  const reviewData = {
    author_id: user.id,
    business_id: Number(businessId),
    title: String(title),
    summary: String(summary),
    service_date: serviceDate ? String(serviceDate) : null,
    status: 'pending', // All new reviews are pending moderation
    quality,
    professionalism,
    punctuality,
    communication,
    value,
    overall_rating: overall_rating,
  };

  // 5. Insert the data into the database
  const { data: insertedReview, error } = await supabase.from('reviews').insert(reviewData).select('businesses(slug)').single();

  if (error || !insertedReview) {
    console.error('Error submitting review:', error);
    throw new Error('There was an error submitting your review. Please try again.');
  }

  // 6. On success, revalidate paths and redirect
  const businessSlug = insertedReview.businesses?.slug;
  if (businessSlug) {
    revalidatePath(`/business/${businessSlug}`);
  }
  revalidatePath('/admin');
  redirect(`/business/${businessSlug}`);
}