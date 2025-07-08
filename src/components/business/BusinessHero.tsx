// src/components/business/BusinessHero.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BusinessHero() {
  return (
    <section
      className="w-full bg-gray-900 text-white"
      aria-labelledby="business-hero-heading"
    >
      <div className="w-full max-w-6xl mx-auto text-center py-20 md:py-32 px-6">
        <h1
          id="business-hero-heading"
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
        >
          Build Trust. Grow Your Business.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Join thousands of businesses leveraging Revuoo to collect authentic
          reviews, engage with customers, and build an unshakeable online
          reputation.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" asChild>
            <Link
              href="/business-signup"
              aria-label="Claim your business for free on Revuoo"
            >
              Claim Your Business Free
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link
              href="#features"
              aria-label="Explore Revuoo business features"
            >
              Explore Features
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
