// src/app/claim/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function claimBusiness(formData: FormData) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User is not authenticated.')
  }

  const businessId = formData.get('businessId') as string
  const businessSlug = formData.get('businessSlug') as string

  if (!businessId || !businessSlug) {
    throw new Error('Business ID or slug is missing.')
  }

  // Securely update the business owner, ONLY if it's currently not owned.
  const { error } = await supabase
    .from('businesses')
    .update({ owner_id: user.id })
    .eq('id', businessId)
    .is('owner_id', null) // This is the crucial security check

  if (error) {
    console.error('Error claiming business:', error)
    return // We can add a user-facing error message later
  }

  // Revalidate the public business page cache
  revalidatePath(`/business/${businessSlug}`)

  // Redirect the new owner to their business dashboard
  redirect('/dashboard/business')
}