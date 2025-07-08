// src/components/NewsletterSignup.tsx
"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function NewsletterSignup() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-gray-100 border-t"
    >
      <div className="w-full max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2
              id="newsletter-heading"
              className="text-3xl font-bold tracking-tight text-gray-900"
            >
              Stay Informed.
            </h2>
            <p className="text-lg mt-2 text-gray-600">
              Get our best guides, exclusive tips, and new service discoveries
              delivered to your inbox.
            </p>
          </div>

          <form
            className="flex flex-col sm:flex-row w-full max-w-md gap-3 sm:gap-2 mx-auto md:mx-0 md:ml-auto"
            aria-label="Newsletter signup form"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: handle submission
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              className="bg-white"
              aria-label="Email address"
            />
            <Button
              type="submit"
              aria-label="Subscribe to newsletter"
              className="whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
