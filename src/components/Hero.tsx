// src/components/Hero.tsx

import { ShieldCheck, Gauge, Sparkles } from "lucide-react";
import GlobalSearch from "./search/GlobalSearch";
import { ReactNode } from "react";
import Link from "next/link"; // Import Link

const ValueProp = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-500">
    {icon}
    <span className="font-medium">{text}</span>
  </div>
);

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/pattern.svg')] bg-repeat"
        aria-hidden="true"
        role="presentation"
      />

      <div className="relative w-full max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
        <header className="mb-6">
          <h1
            id="hero-heading"
            className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900"
          >
            Unbiased Reviews. Expert Insights.
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-indigo-600 mt-2">
            Your Decision, Simplified.
          </h2>
        </header>

        <p className="mt-6 max-w-prose mx-auto text-lg text-gray-600">
          From local services to the latest software, Revuoo combines real user
          experiences with in-depth analysis to give you total clarity.
        </p>

        {/* Global Search */}
        <div className="mt-10">
          <GlobalSearch />
        </div>

        {/* === NEW: Combined Search Suggestions & Value Props Bar === */}
        <div className="mt-8 mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          {/* Search Suggestions on the left */}
          <div className="text-gray-500">
            Try:{" "}
            <Link
              href="/search?q=best+web+hosting"
              className="font-medium text-indigo-600 hover:underline"
            >
              “best web hosting”
            </Link>
            ,{" "}
            <Link
              href="/search?q=plumbers+in+lagos"
              className="font-medium text-indigo-600 hover:underline"
            >
              “plumbers in Lagos”
            </Link>
          </div>

          {/* Value Props on the right */}
          <div className="hidden sm:flex items-center gap-4">
            <ValueProp
              icon={<ShieldCheck className="h-5 w-5 text-green-500" />}
              text="Verified"
            />
            <ValueProp
              icon={<Gauge className="h-5 w-5 text-blue-500" />}
              text="Revuoo Score"
            />
            <ValueProp
              icon={<Sparkles className="h-5 w-5 text-purple-500" />}
              text="AI Insights"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
