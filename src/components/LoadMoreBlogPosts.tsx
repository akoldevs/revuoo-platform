// src/components/LoadMoreBlogPosts.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import BlogCard from "./BlogCard";
import { fetchMorePosts } from "@/app/blog/actions";
import type { Article } from "@/types/article";
import confetti from "canvas-confetti";
import { toast } from "sonner"; // 🎉 Toasts!

interface LoadMoreBlogPostsProps {
  posts: Article[];
}

export default function LoadMoreBlogPosts({ posts }: LoadMoreBlogPostsProps) {
  const PAGE_SIZE = 6;

  const [page, setPage] = useState(1);
  const [loadedPosts, setLoadedPosts] = useState<Article[]>(posts);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  // ✅ Detect filtering and reset only when needed
  useEffect(() => {
    const isNowFiltered = posts.length < page * PAGE_SIZE;

    setIsFiltered(isNowFiltered);

    if (isNowFiltered || page === 1) {
      setLoadedPosts(posts);
      setHasMore(!isNowFiltered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  // 🎉 Trigger confetti + toast when all posts are loaded
  useEffect(() => {
    if (!hasMore && !isFiltered && page > 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success("🎉 All posts loaded. Time to write your own?");
    }
  }, [hasMore, isFiltered, page]);

  const loadMore = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const newPosts = await fetchMorePosts(nextPage);

    if (newPosts.length > 0) {
      setPage(nextPage);
      setLoadedPosts((prev) => [...prev, ...newPosts]);

      if (newPosts.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loadedPosts.map((article) => (
          <BlogCard key={article._id} article={article} />
        ))}
      </div>

      {!isFiltered && hasMore && (
        <div className="flex justify-center mt-12">
          <Button onClick={loadMore} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
