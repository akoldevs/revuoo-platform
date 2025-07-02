// src/app/reviews/page.tsx
import Link from 'next/link';
import { fetchMoreReviews } from './actions'; // Import our new action
import LoadMoreReviews from '@/components/LoadMoreReviews'; // Import our new component

export const dynamic = 'force-dynamic';

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sortOrder = (searchParams.sort as string) || 'newest';

  // Fetch only the FIRST page of reviews initially
  const initialReviews = await fetchMoreReviews(1, sortOrder);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Explore All Reviews</h1>
          <p className="mt-2 text-lg text-gray-600">Discover authentic experiences from our community.</p>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Link 
              href={`/reviews?sort=newest`} 
              className={`px-3 py-1 text-sm rounded-full ${sortOrder === 'newest' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Newest
            </Link>
            <Link 
              href={`/reviews?sort=highest_rated`}
              className={`px-3 py-1 text-sm rounded-full ${sortOrder === 'highest_rated' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Highest Rated
            </Link>
        </div>
      </div>

      {initialReviews.length > 0 ? (
        // The LoadMoreReviews component now handles displaying the grid and the button
        <LoadMoreReviews initialReviews={initialReviews} sortOrder={sortOrder} />
      ) : (
        <p className="text-center py-10 text-gray-500">No approved reviews have been written yet.</p>
      )}
    </div>
  );
}