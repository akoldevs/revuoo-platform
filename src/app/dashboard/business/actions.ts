// src/app/dashboard/business/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitResponse(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User is not authenticated.')
  }

  const reviewId = formData.get('reviewId') as string
  const businessId = formData.get('businessId') as string
  const responseText = formData.get('responseText') as string

  // Security Check: Does the person submitting own this business?
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', businessId)
    .eq('owner_id', user.id)
    .single()

  if (businessError || !business) {
    throw new Error('User is not authorized to respond for this business.')
  }

  // If security check passes, insert the response
  const { error } = await supabase.from('business_responses').insert({
    review_id: reviewId,
    business_id: businessId,
    response_text: responseText,
    author_id: user.id,
    status: 'approved' // We'll approve automatically for now
  })

  if (error) {
    console.error('Error submitting response:', error)
    return
  }

  // Refresh the data on both the dashboard and the public business page
  revalidatePath('/dashboard/business')
  // We need the business slug to revalidate the public page, which we don't have here.
  // We will add this later. For now, revalidating the dashboard is enough.
}