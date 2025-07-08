'use server'

import { createClient } from '@/lib/supabase/client' // We use the client for user, server for DB
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// This is a temporary server client for use in Server Actions
import { createServerClient } from '@supabase/ssr'

export async function submitReview(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User is not authenticated.')
  }

  const reviewData = {
    title: formData.get('title') as string,
    summary: formData.get('summary') as string,
    // For now, we'll hardcode it to our sample business (ID: 1)
    business_id: 1, 
    author_id: user.id,
    status: 'pending' // All new reviews are pending moderation
  }

  const { error } = await supabase.from('reviews').insert(reviewData)

  if (error) {
    console.error('Error inserting review:', error)
    return
  }

  revalidatePath('/reviews')
  redirect('/dashboard/my-reviews')
}