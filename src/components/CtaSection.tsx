// src/components/CtaSection.tsx
import Link from "next/link";
import { Button } from "./ui/button";

export default function CtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="bg-white">
      <div className="mx-auto max-w-6xl py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2
            id="cta-heading"
            className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Ready to Dive In?
          </h2>
          <p className="mx-auto mt-6 max-w-prose text-lg leading-8 text-gray-300">
            Join thousands of users and businesses building a more transparent
            and trustworthy community. Share your experience or grow your brand
            with us.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-x-6">
            <Link href="/write-a-review" passHref>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-200"
                aria-label="Write a review about a business or service"
              >
                Write a Review
              </Button>
            </Link>
            <Link href="/for-businesses" passHref>
              <Button
                size="lg"
                variant="secondary"
                aria-label="Claim your business profile on Revuoo"
              >
                Claim Your Business
              </Button>
            </Link>
          </div>

          {/* Decorative SVG background */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
            role="presentation"
            focusable="false"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#cta-gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="cta-gradient">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
