// src/components/LoadMoreBlogPosts.tsx
'use client'

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import BlogCard from './BlogCard'; // We reuse our existing BlogCard
import { fetchMorePosts } from '@/app/blog/actions'; // We will create this action next

// Define the shape of the article data
interface Article {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: unknown; // <-- Changed from any to unknown
  categories: {
    title: string;
  }[];
  description: string;
}

export default function LoadMoreBlogPosts({
  initialPosts,
}: {
  initialPosts: Article[];
}) {
  const [posts, setPosts] = useState<Article[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const newPosts = await fetchMorePosts(nextPage);

    if (newPosts.length > 0) {
      setPage(nextPage);
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((article) => (
          <BlogCard key={article._id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button onClick={loadMore} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Load More'}
          </Button>
        </div>
      )}
    </>
  );
}