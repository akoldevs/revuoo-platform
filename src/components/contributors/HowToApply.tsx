// src/components/contributors/HowToApply.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function HowToApply() {
  return (
    <section
      id="apply"
      className="bg-gray-900"
      aria-labelledby="how-to-apply-heading"
    >
      <div className="mx-auto max-w-6xl py-24 px-6 text-center animate-fade-in">
        <h2
          id="how-to-apply-heading"
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Ready to Join Us?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
          We’re currently accepting applications for experts in all our major
          categories. Click below to send us your information and writing
          samples.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg" asChild>
            <a
              href="mailto:contributors@revuoo.com?subject=Contributor Application"
              aria-label="Apply to become a Revuoo contributor via email"
            >
              <Mail className="h-5 w-5 mr-2" />
              Apply via Email
            </a>
          </Button>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Prefer a form?{" "}
          <a
            href="/contributors/form"
            className="text-indigo-400 hover:underline"
          >
            Submit your application here
          </a>
          .
        </p>
      </div>
    </section>
  );
}
