// src/components/ReviewCard.tsx
import Link from 'next/link';

// Define the shape of the review data we expect
interface Review {
  id: number;
  title: string;
  category: string | null;
  rating: number | null;
}

// Define the props for our component
interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/reviews/${review.id}`}>
      <div className="border rounded-lg p-4 h-full hover:shadow-lg transition-shadow duration-200">
        <h3 className="font-bold text-lg mb-2">{review.title}</h3>
        {review.category && (
          <p className="text-sm text-gray-600 mb-2">Category: {review.category}</p>
        )}
        <div className="flex items-center">
          {review.rating && (
            <>
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-xs text-gray-500 ml-2">({review.rating})</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}