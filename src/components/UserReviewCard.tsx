// src/components/UserReviewCard.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Update our Review type to include the potential for responses
type Review = {
  id: number;
  created_at: string;
  title: string;
  summary: string | null;
  overall_rating: number | null;
  business_responses: {
    response_text: string;
    created_at: string;
  }[]; // A review can have an array of responses (though usually just one)
}

export default function UserReviewCard({ review }: { review: Review }) {
  const reviewDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Check if a response exists
  const response = review.business_responses && review.business_responses[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{review.title}</CardTitle>
          <div className="flex items-center text-sm">
            {review.overall_rating && (
              <>
                <span className="text-yellow-500">★</span>
                <span className="ml-1 font-semibold">{review.overall_rating} / 5</span>
              </>
            )}
          </div>
        </div>
        <CardDescription>Reviewed on {reviewDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800">{review.summary}</p>
      </CardContent>

      {/* --- NEW PART --- */}
      {/* If a response exists, display it in the CardFooter */}
      {response && (
        <CardFooter>
          <div className="w-full bg-gray-100 p-4 rounded-md mt-4">
            <h5 className="font-bold text-md">Response from the business:</h5>
            <p className="text-gray-700 mt-2">{response.response_text}</p>
          </div>
        </CardFooter>
      )}
      {/* --- END OF NEW PART --- */}

    </Card>
  );
}