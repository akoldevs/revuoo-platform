// src/components/Hero.tsx
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="w-full bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
        
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Unbiased Reviews. Expert Insights.
        </h1>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-indigo-600 mt-2">
          Your Decision, Simplified.
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          From local services to the latest software, Revuoo combines real user
          experiences with in-depth analysis to give you total clarity.
        </p>

        {/* Global Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-4 pl-12 pr-32 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search for a service, product, or company..."
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center rounded-r-md bg-indigo-600 px-8 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}