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

  const businessId = formData.get('businessId') as string;
  const businessSlug = formData.get('businessSlug') as string;

  if (!businessId || !businessSlug) {
    throw new Error('Business ID or slug is missing.')
  }

  // Handle the services array
  const servicesString = formData.get('services') as string;
  let servicesArray: string[] = [];
  try {
    servicesArray = JSON.parse(servicesString);
  } catch (error) {
    console.error("Failed to parse services JSON:", error);
  }

  // --- NEW: Handle the operating hours object ---
  const operatingHoursString = formData.get('operatingHours') as string;
  let operatingHoursObject = {};
  try {
    operatingHoursObject = JSON.parse(operatingHoursString);
  } catch (error) {
    console.error("Failed to parse operating hours JSON:", error);
  }

  // Prepare the final data object for the database update
  const updatedData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    address: formData.get('address') as string,
    phone_number: formData.get('phone_number') as string,
    website_url: formData.get('website_url') as string,
    business_email: formData.get('business_email') as string,
    services: servicesArray,
    operating_hours: operatingHoursObject, // <-- Add the parsed hours object
  }

  const { error } = await supabase
    .from('businesses')
    .update(updatedData)
    .eq('id', businessId)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Error updating business profile:', error)
    return { error: 'Failed to update profile.' }
  }

  revalidatePath('/dashboard/business');
  revalidatePath(`/business/${businessSlug}`);

  redirect('/dashboard/business')
}