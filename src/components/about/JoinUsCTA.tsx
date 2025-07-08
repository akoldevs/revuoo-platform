// src/components/about/JoinUsCTA.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JoinUsCTA() {
  return (
    <section
      className="bg-gray-900 py-24 px-6 text-center"
      aria-labelledby="join-us-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="join-us-heading"
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Join the Revuoo Community
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
          Whether you&apos;re a consumer seeking clarity or a business dedicated
          to quality, you have a place here. Help us shape the future of trust.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <Button size="lg" asChild>
            <Link href="/write-a-review" aria-label="Write a Verified Review">
              Write a Verified Review
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link
              href="/for-businesses"
              aria-label="List Your Business on Revuoo"
            >
              List Your Business
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
