"use client";

import { Button } from "@/components/ui/button";

export default function AffiliatesHero() {
  return (
    <section className="bg-gray-900" aria-labelledby="affiliates-hero-heading">
      <div className="relative isolate pt-14">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto animate-fade-in">
            <h1
              id="affiliates-hero-heading"
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            >
              Partner with Revuoo: Grow with Trust. Earn with Impact.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Join the Revuoo Affiliate Program and earn recurring revenue by
              helping businesses build credibility through verified reviews and
              AI-powered insights.
            </p>
            <p className="mt-4 text-sm text-indigo-400">
              Trusted by 500+ businesses across 50+ industries
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
              <Button size="lg" asChild>
                <a
                  href="#apply"
                  aria-label="Apply to become a Revuoo affiliate"
                >
                  Become a Revuoo Affiliate
                </a>
              </Button>
              <a
                href="/affiliates#how-it-works"
                className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                aria-label="Learn how the Revuoo affiliate program works"
              >
                Learn how it works →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
