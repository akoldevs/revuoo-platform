// src/app/write/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- Import the router
import { Input } from "@/components/ui/input";
import { searchBusinesses } from './actions';
import { Search } from 'lucide-react';

// Define the type for a business search result
type BusinessSearchResult = {
  id: number;
  name: string;
  slug: string; // <-- We will need the slug to navigate
};

export default function WritePage() {
  const router = useRouter(); // <-- Initialize the router
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BusinessSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    // We need to update our action to also return the slug
    const results = await searchBusinesses(query); 
    setSearchResults(results);
    setIsLoading(false);
  };

  // When a user selects a business, we navigate them to the next step
  const handleSelectBusiness = (business: BusinessSearchResult) => {
    router.push(`/write-a-review/${business.slug}`);
  };

  return (
    <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Share your experience
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Help others make the right choice by leaving a review for a business you've used.
        </p>

        {/* --- The Focused Search Bar --- */}
        <div className="mt-10 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
            className="w-full text-lg p-6 pl-12 rounded-full shadow-lg"
            placeholder="Search for a company or website..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded-md mt-2 shadow-lg text-left">
              <ul>
                {searchResults.map((business) => (
                  <li 
                    key={business.id} 
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectBusiness(business)}
                  >
                    {business.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}