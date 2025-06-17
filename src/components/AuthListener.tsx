// src/components/AuthListener.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthListener() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // This event fires when a user logs in or signs up and confirms their email.

        // Check if the user has a profile with a username
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()

        // If they have a profile but no username, they are a new user. Redirect them.
        if (profile && !profile.username) {
          router.push('/account/setup')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // This component does not render anything visible.
  return null
}