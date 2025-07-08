// src/app/dashboard/business/BusinessReviewItem.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitResponse } from './actions'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function BusinessReviewItem({ review, businessId }: { review: any, businessId: number }) {
  const [isReplying, setIsReplying] = useState(false)
  const existingResponse = review.business_responses && review.business_responses[0];

  // A helper to get initials from an email for the avatar fallback
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            {/* We don't have user avatars yet, so we'll use a fallback */}
            <AvatarFallback>{review.author_id ? getInitials(review.author_id.slice(0, 2)) : 'U'}</AvatarFallback>
          </Avatar>

          <div className="w-full">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{review.title}</p>
              <Badge variant={review.overall_rating >= 4 ? 'default' : 'destructive'}>
                ★ {review.overall_rating} / 5
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {/* We will need to join with the users table to get author name later */}
              by a Revuoo user on {new Date(review.created_at).toLocaleDateString()}
            </p>
            <p className="mt-3 text-gray-800">{review.summary}</p>
          </div>
        </div>

        {/* Response Section */}
        <div className="mt-4 pl-14">
          {existingResponse ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              <h4 className="font-semibold text-md mb-2 text-green-900">Your Response:</h4>
              <p className="text-green-800">{existingResponse.response_text}</p>
            </div>
          ) : isReplying ? (
            <form action={submitResponse} onSubmit={() => setIsReplying(false)}>
              <input type="hidden" name="reviewId" value={review.id} />
              <input type="hidden" name="businessId" value={businessId} />
              <Textarea
                name="responseText"
                placeholder="Write your public response here..."
                required
                className="mb-2"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="ghost" onClick={() => setIsReplying(false)}>Cancel</Button>
                <Button type="submit">Submit Response</Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsReplying(true)}>Respond</Button>
          )}
        </div>

      </CardContent>
    </Card>
  )
}