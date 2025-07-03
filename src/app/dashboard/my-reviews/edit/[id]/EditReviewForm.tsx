// src/app/dashboard/my-reviews/edit/[id]/EditReviewForm.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateReview } from '../../actions'; // <-- IMPORT our update action

function AspectRating({ label, name, defaultValue }: { label: string, name: string, defaultValue: number | null }) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor={name} className="text-right">
        {label}
      </Label>
      <div className="col-span-2">
        <Select name={name} defaultValue={defaultValue?.toString()}>
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

// Define a type for the review prop
type Review = {
  id: number;
  title: string;
  summary: string;
  service_date: string;
  quality: number | null;
  professionalism: number | null;
  punctuality: number | null;
  communication: number | null;
  value: number | null;
  // Add any other fields your review object may have
};

export default function EditReviewForm({ review }: { review: Review }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Edit Your Review</CardTitle>
        <CardDescription>
          Make changes to your review below and save.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* The form now calls our updateReview server action */}
        <form action={updateReview} className="space-y-8">
          <input type="hidden" name="reviewId" value={review.id} />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Review</h3>
            <div className="space-y-2">
              <Label htmlFor="review-title">Review Title</Label>
              <Input name="title" id="review-title" defaultValue={review.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-summary">Your Full Review</Label>
              <Textarea name="summary" id="review-summary" defaultValue={review.summary || ''} rows={6} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-date">Date of Service</Label>
               <Input name="service_date" id="service-date" type="date" defaultValue={review.service_date} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Breakdown Your Rating</h3>
             <div className="space-y-4 rounded-md border p-4">
                <AspectRating label="Quality" name="quality" defaultValue={review.quality} />
                <AspectRating label="Professionalism" name="professionalism" defaultValue={review.professionalism} />
                <AspectRating label="Punctuality" name="punctuality" defaultValue={review.punctuality} />
                <AspectRating label="Communication" name="communication" defaultValue={review.communication} />
                <AspectRating label="Value" name="value" defaultValue={review.value} />
             </div>
          </div>

          <Button type="submit" size="lg" className="w-full">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}