// src/components/dashboard/business/BusinessReviewItem.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitResponse } from "@/app/dashboard/business/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react"; // Import new icons
import { toast } from "sonner";

// Keep the existing types...
type BusinessResponse = {
  response_text: string;
};

type Review = {
  id: string;
  title: string;
  summary: string;
  created_at: string;
  overall_rating: number;
  author_id?: string;
  business_responses?: BusinessResponse[];
};

export default function BusinessReviewItem({
  review,
  businessId,
}: {
  review: Review;
  businessId: number;
}) {
  const [isReplying, setIsReplying] = useState(false);
  // --- NEW STATE for the AI response ---
  const [responseText, setResponseText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const existingResponse =
    review.business_responses && review.business_responses[0];

  // --- NEW HANDLER for the AI button ---
  const handleGenerateSuggestion = async () => {
    setIsGenerating(true);
    // In the future, this will call our Edge Function.
    // For now, we simulate a response after 1.5 seconds.
    setTimeout(() => {
      const suggestion =
        review.overall_rating >= 4
          ? `Thank you so much for your kind words and for taking the time to share your experience! We are thrilled to hear you had a great visit and we look forward to seeing you again soon.`
          : `We are very sorry to hear about your experience. Providing excellent service is our top priority, and it seems we fell short. We take this feedback very seriously and would appreciate the opportunity to make things right.`;

      setResponseText(suggestion); // Update the textarea with the AI suggestion
      toast.success("AI suggestion generated!");
      setIsGenerating(false);
    }, 1500);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{review.title}</p>
              <Badge
                variant={review.overall_rating >= 4 ? "default" : "destructive"}
              >
                ★ {review.overall_rating} / 5
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              by a Revuoo user on{" "}
              {new Date(review.created_at).toLocaleDateString()}
            </p>
            <p className="mt-3 text-gray-800">{review.summary}</p>
          </div>
        </div>

        <div className="mt-4 pl-14">
          {existingResponse ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              <h4 className="font-semibold text-md mb-2 text-green-900">
                Your Response:
              </h4>
              <p className="text-green-800">{existingResponse.response_text}</p>
            </div>
          ) : isReplying ? (
            // === This is the updated reply form ===
            <form
              action={submitResponse}
              onSubmit={() => {
                setIsReplying(false);
                setResponseText("");
              }}
            >
              <input type="hidden" name="reviewId" value={review.id} />
              <input type="hidden" name="businessId" value={businessId} />
              <Textarea
                name="responseText"
                placeholder="Write your public response here, or generate one with AI."
                required
                className="mb-2"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSuggestion}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate Suggestion"}
                </Button>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsReplying(false);
                      setResponseText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit Response</Button>
                </div>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsReplying(true)}>Respond</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
