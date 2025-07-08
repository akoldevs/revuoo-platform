// src/app/dashboard/business/edit/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateBusinessProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User is not authenticated.')
  }

  const businessId = formData.get('businessId') as string
  if (!businessId) {
    throw new Error('Business ID is missing.')
  }

  // Create an object with all the updated data from the form
  const updatedData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    address: formData.get('address') as string,
    phone_number: formData.get('phone_number') as string,
    website_url: formData.get('website_url') as string,
    business_email: formData.get('business_email') as string,
  }

  // Securely update the business profile, ensuring the user is the owner
  const { error } = await supabase
    .from('businesses')
    .update(updatedData)
    .eq('id', businessId)
    .eq('owner_id', user.id) // Security check

  if (error) {
    console.error('Error updating business profile:', error)
    return { error: 'Failed to update profile.' }
  }

  // Revalidate the paths so the changes are visible immediately
  revalidatePath('/dashboard/business')
  // We need the business slug to revalidate the public page. We'll add this later.

  // Redirect back to the main business dashboard
  redirect('/dashboard/business')
}