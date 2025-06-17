'use client'

import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return <div className="w-[88px] h-[40px]"></div>
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="hidden sm:inline">Hey, {user.email}</span>
      <button onClick={handleSignOut} className="py-2 px-4 rounded-md no-underline bg-gray-200 hover:bg-gray-300">
        Logout
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-gray-200 hover:bg-gray-300"
    >
      Login
    </Link>
  )
}