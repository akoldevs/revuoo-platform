// src/components/help/HelpHeader.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HelpHeader() {
  return (
    <section className="bg-gray-50 py-20 md:py-24">
      <div className="w-full max-w-3xl mx-auto text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Revuoo Help Center
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          What can we help you with today?
        </p>
        <div className="mt-8 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for articles..."
              className="w-full pl-10 py-6 text-base"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
