'use client'

import { submitReview } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function WriteReviewForm() {
  return (
    <form action={submitReview} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Review Title</Label>
        <Input id="title" name="title" type="text" placeholder="e.g., 'An Outstanding and Thorough Service'" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Your Detailed Review</Label>
        <Textarea
          id="summary"
          name="summary"
          placeholder="Share the details of your experience..."
          required
          rows={8}
        />
      </div>

      <Button type="submit" className="w-full text-lg">
        Submit Review for Moderation
      </Button>
    </form>
  )
}