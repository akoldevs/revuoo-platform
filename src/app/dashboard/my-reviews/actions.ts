// src/app/dashboard/my-reviews/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation' // <-- THE MISSING IMPORT IS ADDED HERE

export async function deleteReview(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User is not authenticated.')
  }

  const reviewId = formData.get('reviewId') as string
  if (!reviewId) {
    throw new Error('Review ID is missing.')
  }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .match({ id: reviewId, author_id: user.id })

  if (error) {
    console.error('Error deleting review:', error)
    return
  }

  revalidatePath('/dashboard/my-reviews')
}

export async function updateReview(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User is not authenticated.')
  }

  const reviewId = formData.get('reviewId') as string
  if (!reviewId) {
    throw new Error('Review ID is missing.')
  }

  const updatedData = {
    title: formData.get('title') as string,
    summary: formData.get('summary') as string,
    service_date: formData.get('serviceDate') as string,
    overall_rating: Number(formData.get('overallRating')),
    quality: Number(formData.get('quality')),
    professionalism: Number(formData.get('professionalism')),
    punctuality: Number(formData.get('punctuality')),
    communication: Number(formData.get('communication')),
    value: Number(formData.get('value')),
  }

  const { error } = await supabase
    .from('reviews')
    .update(updatedData)
    .match({ id: reviewId, author_id: user.id })

  if (error) {
    console.error('Error updating review:', error)
    return { error: 'Failed to update review.' }
  }

  revalidatePath('/dashboard/my-reviews')
  revalidatePath(`/reviews/${reviewId}`)

  redirect('/dashboard/my-reviews')
}