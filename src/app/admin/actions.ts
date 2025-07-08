// src/app/admin/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
  const supabase = await createClient() // <-- ADDED AWAIT
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error("Not authorized")
  }
}

export async function approveReview(formData: FormData) {
  await verifyAdmin()
  const reviewId = formData.get('reviewId') as string
  const supabase = await createClient() // <-- ADDED AWAIT
  const { error } = await supabase
    .from('reviews')
    .update({ status: 'approved' })
    .eq('id', reviewId)
  if (error) throw error
  revalidatePath('/admin')
}

export async function rejectReview(formData: FormData) {
  await verifyAdmin()
  const reviewId = formData.get('reviewId') as string
  const supabase = await createClient() // <-- ADDED AWAIT
  const { error } = await supabase
    .from('reviews')
    .update({ status: 'rejected' })
    .eq('id', reviewId)
  if (error) throw error
  revalidatePath('/admin')
}

export async function approveResponse(formData: FormData) {
  await verifyAdmin();
  const responseId = formData.get('responseId') as string;
  const supabase = await createClient(); // <-- ADDED AWAIT
  const { error } = await supabase
    .from('business_responses')
    .update({ status: 'approved' })
    .eq('id', responseId);
  if (error) throw error;
  revalidatePath('/admin');
}

export async function rejectResponse(formData: FormData) {
  await verifyAdmin();
  const responseId = formData.get('responseId') as string;
  const supabase = await createClient(); // <-- ADDED AWAIT
  const { error } = await supabase
    .from('business_responses')
    .update({ status: 'rejected' })
    .eq('id', responseId);
  if (error) throw error;
  revalidatePath('/admin');
}