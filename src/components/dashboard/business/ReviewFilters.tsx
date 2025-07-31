// src/components/dashboard/business/ReviewFilters.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback } from "react";

export default function ReviewFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current values from URL or set defaults
  const currentSort = searchParams.get("sort") || "newest";
  const currentRating = searchParams.get("rating") || "all";

  // This function creates the new URL string when a filter changes
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <Select
          value={currentSort}
          onValueChange={(value) => {
            router.push(pathname + "?" + createQueryString("sort", value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest_rated">Highest Rated</SelectItem>
            <SelectItem value="lowest_rated">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Filter by rating:
        </span>
        <Select
          value={currentRating}
          onValueChange={(value) => {
            router.push(pathname + "?" + createQueryString("rating", value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
