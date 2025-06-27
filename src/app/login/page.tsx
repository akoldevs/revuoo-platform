'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(false)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This is the page the user will be redirected to after clicking the magic link
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error sending magic link:', error)
      alert('Error: Could not send magic link.')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm mx-auto py-12 px-6 text-center">
         <h1 className="text-2xl font-bold mb-4">Check your email</h1>
         <p>A magic link has been sent to **{email}**. Click the link to sign in.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-6">Sign In / Sign Up</h1>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
        >
          Sign in with Magic Link
        </button>
      </form>
    </div>
  )
}