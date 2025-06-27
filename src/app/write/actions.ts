// src/app/write/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitReview(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to submit a review.' }
  }

  const reviewData = {
    title: formData.get('title') as string,
    summary: formData.get('summary') as string,
    service_date: formData.get('serviceDate') as string,
    overall_rating: Number(formData.get('overallRating')),
    quality: Number(formData.get('quality')),
    professionalism: Number(formData.get('professionalism')),
    punctuality: Number(formData.get('punctuality')),
    communication: Number(formData.get('communication')),
    value: Number(formData.get('value')),
    author_id: user.id,
    category: 'Home Services',
    status: 'pending' // Explicitly set new reviews as pending moderation
  }

  const { error } = await supabase.from('reviews').insert(reviewData)

  if (error) {
    console.error('Error inserting review:', error)
    return { error: 'Failed to submit review.' }
  }

  revalidatePath('/reviews')
  redirect('/reviews')
}