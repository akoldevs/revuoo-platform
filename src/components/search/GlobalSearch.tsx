// src/components/search/GlobalSearch.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Building, Folder, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  type: "business" | "category" | "post";
}

const getIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "business":
      return <Building className="h-4 w-4 text-gray-500" />;
    case "category":
      return <Folder className="h-4 w-4 text-gray-500" />;
    case "post":
      return <Newspaper className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};

// === THIS IS THE FIX ===
// A new helper function to build the correct URL path for each type.
const getLinkPath = (result: SearchResult): string => {
  switch (result.type) {
    case "business":
      return `/business/${result.slug}`;
    case "category":
      return `/categories/${result.slug}`; // Use the plural form
    case "post":
      return `/blog/${result.slug}`;
    default:
      return "/";
  }
};

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const supabase = createClient();

  const performSearch = useCallback(
    async (searchTerm: string) => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      const { data, error } = await supabase.rpc("search_revuoo", {
        search_term: searchTerm,
      });
      if (error) {
        console.error("Search error:", error);
        setIsLoading(false);
        return;
      }

      const combinedResults = [
        ...(data.businesses || []),
        ...(data.categories || []),
        ...(data.posts || []),
      ];
      setResults(combinedResults);
      setIsLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <form className="relative" onSubmit={(e) => e.preventDefault()}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          name="search"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-lg border-0 py-5 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:shadow-lg sm:text-base sm:leading-6"
          placeholder="Search for a service, product, or company..."
        />
      </form>

      {query.length > 1 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg border z-30">
          {isLoading && (
            <p className="p-4 text-sm text-gray-500">Searching...</p>
          )}
          {!isLoading && results.length === 0 && debouncedQuery && (
            <p className="p-4 text-sm text-gray-500">No results found.</p>
          )}
          {!isLoading && results.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {results.map((result) => (
                <li key={`${result.type}-${result.id}`}>
                  {/* Use the helper function to create the correct link */}
                  <Link
                    href={getLinkPath(result)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50"
                  >
                    {getIcon(result.type)}
                    <span className="text-sm font-medium text-gray-800">
                      {result.name}
                    </span>
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full capitalize">
                      {result.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
