// src/app/business/[slug]/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server';

// This is a "fire-and-forget" action. We don't need it to return anything.
export async function incrementViewCount(businessId: number) {
  try {
    const supabase = await createClient();
    // We call the database function (RPC) we just created.
    const { error } = await supabase.rpc('increment_business_view_count', {
      p_business_id: businessId,
    });

    if (error) {
      console.error('Error incrementing view count:', error);
    }
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
}