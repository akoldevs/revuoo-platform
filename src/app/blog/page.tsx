// src/app/blog/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchMorePosts } from "./actions";
import LoadMoreBlogPosts from "@/components/LoadMoreBlogPosts";
import type { Article } from "@/types/article"; // Optional: shared type

export const dynamic = "force-dynamic";

const categories = ["All", "Marketing", "Productivity", "Finance"];

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<Article[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadInitialPosts() {
      const posts = await fetchMorePosts(1);
      setAllPosts(posts);
      setFilteredPosts(posts);
    }

    loadInitialPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter((post) =>
        post.categories?.some(
          (cat: { title: string }) => cat.title === selectedCategory
        )
      );
      setFilteredPosts(filtered);
    }
  }, [selectedCategory, allPosts]);

  return (
    <main
      className="w-full max-w-6xl mx-auto px-6 py-12 animate-fade-in"
      aria-labelledby="blog-heading"
    >
      {/* Page Header */}
      <header className="text-center border-b pb-6 mb-10">
        <h1
          id="blog-heading"
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
        >
          Guides & Insights
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Your hub for expert analysis, tips, and buying guides.
        </p>
      </header>

      {/* ✅ Category Filters */}
      <nav className="flex justify-center gap-4 mb-10 text-sm text-gray-600">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full transition ${
              selectedCategory === category
                ? "bg-indigo-600 text-white"
                : "hover:text-indigo-600"
            }`}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* ✅ Blog Posts or Empty State */}
      {filteredPosts.length > 0 ? (
        <LoadMoreBlogPosts posts={filteredPosts} />
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No posts found in this category.</p>
          <p className="mt-2 text-sm">Try selecting a different filter.</p>
        </div>
      )}
    </main>
  );
}
