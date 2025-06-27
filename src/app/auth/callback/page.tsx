'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        router.push('/login') // Redirect to login on error
        return
      }

      if (data.session) {
        // We have a valid Supabase session.
        // Now, we'll sign into NextAuth by passing the user data.
        await signIn('credentials', {
          user: JSON.stringify(data.session.user),
          redirect: false, // We will handle the redirect manually
        })
        // After signing into NextAuth, redirect to the homepage.
        router.push('/')
        router.refresh() // Force a refresh to update the UI
      }
    }

    handleAuthCallback()
  }, [router])

  return <p className="text-center p-12">Please wait, authenticating...</p>
}