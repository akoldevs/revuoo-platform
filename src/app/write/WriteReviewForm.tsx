// src/app/write/WriteReviewForm.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import { submitReview } from './actions'

// Import our new shadcn/ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function WriteReviewForm() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
      } else {
        router.push('/login?message=Please log in to write a review')
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <p>Redirecting to login...</p>
  }

  return (
    <form action={submitReview} className="space-y-6">
      <p className="text-sm text-gray-600">You are logged in as {user.email}.</p>

      <input type="hidden" name="authorId" value={user.id} />

      <div className="space-y-2">
        <Label htmlFor="title">Review Title</Label>
        <Input id="title" name="title" type="text" placeholder="e.g., 'An Outstanding and Thorough Service'" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary / Body</Label>
        <Textarea
          id="summary"
          name="summary"
          placeholder="Share the details of your experience..."
          required
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceDate">Date of Service</Label>
        <Input id="serviceDate" name="serviceDate" type="date" required />
      </div>

      <hr />

      <h2 className="text-xl font-semibold">Aspect Ratings (1-5)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Overall Rating', name: 'overallRating' },
          { label: 'Quality of Cleaning', name: 'quality' },
          { label: 'Staff Professionalism', name: 'professionalism' },
          { label: 'Punctuality & Reliability', name: 'punctuality' },
          { label: 'Booking & Communication', name: 'communication' },
          { label: 'Value for Money', name: 'value' },
        ].map(aspect => (
          <div className="space-y-2" key={aspect.name}>
            <Label>{aspect.label}</Label>
            <Input
              name={aspect.name}
              type="number" min="1" max="5" step="0.5"
              defaultValue="3" required
            />
          </div>
        ))}
      </div>

      <hr />

      <Button type="submit" className="w-full text-lg">
        Submit Review
      </Button>
    </form>
  )
}