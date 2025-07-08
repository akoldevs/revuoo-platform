// src/components/contributors/ContributorHero.tsx

"use client";

import { Button } from "@/components/ui/button";

export default function ContributorHero() {
  return (
    <section
      className="w-full bg-gray-50"
      aria-labelledby="contributor-hero-heading"
    >
      <div className="w-full max-w-6xl mx-auto text-center py-20 md:py-32 px-6 animate-fade-in">
        <h1
          id="contributor-hero-heading"
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6"
        >
          Become a Revuoo Expert
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Share your expertise, build your personal brand, and get paid for your
          insights. Join our community of trusted writers and industry
          professionals.
        </p>
        <div className="flex justify-center items-center gap-4">
          <Button size="lg" asChild>
            <a href="#apply" aria-label="Apply to become a Revuoo contributor">
              Apply Now
            </a>
          </Button>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Applications reviewed weekly. We welcome experts from all industries.
        </p>
      </div>
    </section>
  );
}
