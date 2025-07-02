// src/app/write-a-review/[slug]/ReviewForm.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from './actions'; // <-- CORRECTLY IMPORT THE ACTION

// The AspectRating now needs a 'name' prop for the form
function AspectRating({ label, name }: { label: string, name: string }) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor={name} className="text-right">
        {label}
      </Label>
      <div className="col-span-2">
        <Select name={name} required>
          <SelectTrigger id={name}>
            <SelectValue placeholder="Select a rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 - Excellent</SelectItem>
            <SelectItem value="4">4 - Good</SelectItem>
            <SelectItem value="3">3 - Average</SelectItem>
            <SelectItem value="2">2 - Poor</SelectItem>
            <SelectItem value="1">1 - Terrible</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// The Form receives the business name and ID as props
export default function ReviewForm({ businessId, businessName }: { businessId: number, businessName: string }) {
  return (
     <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Write a Review for</CardTitle>
        <CardDescription className="text-xl font-semibold text-indigo-600 pt-1">
          {businessName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* The form now correctly calls our server action */}
        <form action={submitReview} className="space-y-8">
          <input type="hidden" name="businessId" value={businessId} />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Review</h3>
            <div className="space-y-2">
              <Label htmlFor="review-title">Review Title</Label>
              <Input name="title" id="review-title" placeholder="e.g., 'Excellent Service and Very Professional'" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-summary">Your Full Review</Label>
              <Textarea name="summary" id="review-summary" placeholder="Describe your experience in detail. What did you like or dislike?" rows={6} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-date">Date of Service</Label>
               <Input name="service_date" id="service-date" type="date" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Breakdown Your Rating</h3>
             <div className="space-y-4 rounded-md border p-4">
                <AspectRating label="Quality" name="quality" />
                <AspectRating label="Professionalism" name="professionalism" />
                <AspectRating label="Punctuality" name="punctuality" />
                <AspectRating label="Communication" name="communication" />
                <AspectRating label="Value" name="value" />
             </div>
          </div>

          <Button type="submit" size="lg" className="w-full">Submit Review</Button>
        </form>
      </CardContent>
    </Card>
  );
}