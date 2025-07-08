// src/components/widgets/WidgetsHero.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const socialProof = [
  "Join 500+ businesses who increased on-page trust.",
  "Showcase your hard-earned reputation in minutes.",
  "Trusted by businesses in over 50+ categories.",
];

export default function WidgetsHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % socialProof.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative isolate overflow-hidden bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        {/* Text Section */}
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Showcase Your Trust. Power Your Business.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Integrate Revuoo&apos;s powerful tools directly onto your website to
            boost conversions, streamline workflows, and build unparalleled
            customer confidence.
          </p>
          <div className="mt-8 h-6 text-base text-gray-400">
            {socialProof[currentIndex]}
          </div>
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
            <Button size="lg" asChild>
              <Link href="/for-businesses/plans-pricing">View Plans</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <Link href="#">Book a Demo</Link>
            </Button>
          </div>
        </div>

        {/* Image Section - UPDATED TO USE A LOCAL IMAGE */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              // === THIS IS THE FIX ===
              // This path now points directly to the file in your /public folder
              src="/widget-hero-preview.png"
              alt="Preview of Revuoo widgets on a dark-themed app interface"
              width={2432}
              height={1442}
              className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
