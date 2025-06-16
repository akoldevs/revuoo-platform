// src/app/account/setup/AccountForm.tsx
'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation' // <-- 1. IMPORT THE ROUTER

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const router = useRouter() // <-- 2. INITIALIZE THE ROUTER
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    // ... (this function remains the same)
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile(formData: FormData) {
    setLoading(true)

    const fullname = formData.get('fullName') as string
    const username = formData.get('username') as string
    const website = formData.get('website') as string

    const { error } = await supabase.from('profiles').upsert({
      id: user?.id as string,
      full_name: fullname,
      username: username,
      website: website,
      updated_at: new Date().toISOString(),
    })
    
    setLoading(false) // Moved this up

    if (error) {
      alert(error.message)
    } else {
      alert('Profile updated successfully!')
      router.push('/') // <-- 3. ADD THE REDIRECT HERE
    }
  }

  // ... (the return statement with the JSX remains the same)
  return (
    <div className="w-full max-w-lg mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
        <form action={updateProfile} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="text" value={user?.email} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100" />
            </div>
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                <input
                    id="website"
                    name="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>

            <div>
                <button
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Saving ...' : 'Update Profile'}
                </button>
            </div>
        </form>
    </div>
  )
}