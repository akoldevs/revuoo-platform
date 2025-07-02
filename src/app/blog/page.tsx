// src/app/blog/page.tsx
import { fetchMorePosts } from './actions'; // Import our new action
import LoadMoreBlogPosts from '@/components/LoadMoreBlogPosts'; // Import our new component

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Fetch only the FIRST page of posts initially
  const initialPosts = await fetchMorePosts(1);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="text-center border-b pb-6 mb-8">
        <h1 className="text-4xl font-bold">Guides & Insights</h1>
        <p className="mt-2 text-lg text-gray-600">Your hub for expert analysis, tips, and buying guides.</p>
      </div>

      {initialPosts.length > 0 ? (
        // The LoadMore component now handles displaying the grid and the button
        <LoadMoreBlogPosts initialPosts={initialPosts} />
      ) : (
        <p className="text-center py-10 text-gray-500">No guides have been published yet. Check back soon!</p>
      )}
    </div>
  );
}