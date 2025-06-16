// src/app/login/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // This listener is still useful for client-side redirects, e.g., after social auth
      if (session) {
        // A session is active, maybe refresh the page to let server components re-render
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: 'auto', paddingTop: '5rem' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="auto"
        providers={['github', 'google']}
        // This is the corrected line:
        redirectTo={`/auth/callback`}
      />
    </div>
  )
}