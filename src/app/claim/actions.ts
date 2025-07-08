// src/app/claim/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function claimBusiness(formData: FormData) {
  console.log('--- Step 1: `claimBusiness` Server Action started. ---');

  try {
    const supabase = await createClient();
    const businessId = formData.get('businessId') as string;
    const businessSlug = formData.get('businessSlug') as string;

    console.log(`--- Step 2: Attempting to claim business ID: ${businessId} ---`);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('--- ACTION FAILED: User is not authenticated. ---');
      throw new Error('User is not authenticated.');
    }

    console.log(`--- Step 3: Action is being run by user ID: ${user.id} ---`);

    if (!businessId) {
      console.error('--- ACTION FAILED: Business ID is missing from form data. ---');
      throw new Error('Business ID is missing.');
    }

    console.log(`--- Step 4: Preparing to update 'businesses' table in Supabase... ---`);
    console.log(`--- Setting owner_id = ${user.id} WHERE id = ${businessId} AND owner_id IS NULL ---`);

    const { error } = await supabase
      .from('businesses')
      .update({ owner_id: user.id })
      .eq('id', businessId)
      .is('owner_id', null); // Security check to prevent double-claiming

    if (error) {
      console.error('--- STEP 5 FAILED: Supabase returned an error during update ---', error);
      return { error: 'Failed to claim business profile due to a database error.' };
    }

    console.log('--- Step 5 SUCCEEDED: Database update was successful. ---');

    revalidatePath(`/business/${businessSlug}`);
    console.log(`--- Step 6: Path for /business/${businessSlug} revalidated. ---`);

  } catch (e) {
    console.error('--- A CRITICAL ERROR occurred in the try/catch block ---', e);
    return { error: 'A critical server error occurred.' };
  }

  // This redirect will only happen if there are no errors.
  redirect('/dashboard/business');
}