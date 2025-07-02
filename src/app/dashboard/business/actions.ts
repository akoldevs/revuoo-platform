// src/app/dashboard/business/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitResponse(formData: FormData) {
  const supabase = await createClient();

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  // 2. Get form data
  const reviewId = formData.get('reviewId');
  const businessId = formData.get('businessId');
  const responseText = formData.get('responseText');

  if (!reviewId || !businessId || !responseText) {
    throw new Error("Missing form data");
  }

  // 3. SECURITY CHECK: Verify the user owns the business they are responding for
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', businessId)
    .eq('owner_id', user.id)
    .single();
  
  if (businessError || !business) {
    throw new Error("You are not authorized to respond for this business.");
  }
  
  // 4. Insert the response into the database
  const { error: insertError } = await supabase
    .from('business_responses')
    .insert({
      review_id: Number(reviewId),
      business_id: Number(businessId),
      response_text: String(responseText),
      author_id: user.id,
      status: 'pending', // All responses must be moderated
    });
  
  if (insertError) {
    console.error("Error submitting response:", insertError);
    throw new Error("Could not submit response.");
  }
  
  // 5. Revalidate the path to refresh the UI
  revalidatePath('/dashboard/business');
}