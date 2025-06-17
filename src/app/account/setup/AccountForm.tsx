// src/app/account/setup/AccountForm.tsx
'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function AccountForm() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase])

  const getProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true)
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        // Now we are using the 'error' variable
        console.error('Error loading user data:', error)
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
      }
    } catch (error) {
      alert('An error occurred while fetching your profile.')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (user) {
      getProfile()
    }
  }, [user, getProfile])

  async function updateProfile(formData: FormData) {
    if (!user) return;
    setLoading(true)
    const fullname = formData.get('fullName') as string
    const username = formData.get('username') as string
    const website = formData.get('website') as string

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullname,
      username,
      website,
      updated_at: new Date().toISOString(),
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert('Profile updated successfully!')
      router.push('/')
    }
  }

  if (!user) {
    return <p className="text-center p-12">Loading...</p>
  }

  return (
    <div className="w-full max-w-lg mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
        <form action={updateProfile}>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user.email} disabled />
            </div>
            <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    name="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>
            <div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving ...' : 'Update Profile'}
                </button>
            </div>
        </form>
    </div>
  )
}