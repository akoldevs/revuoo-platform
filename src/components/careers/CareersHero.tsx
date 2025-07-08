"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Briefcase } from "lucide-react";

export default function CareersHero() {
  return (
    <section
      className="relative bg-gray-800"
      aria-labelledby="careers-hero-heading"
    >
      {/* Background Image */}
      <div
        className="h-80 w-full absolute bottom-0 xl:inset-y-0 xl:left-0 xl:h-full xl:w-1/2"
        role="img"
        aria-label="People collaborating at a table"
      >
        <Image
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2187&auto=format&fit=crop"
          alt="People working at a table"
          width={2187}
          height={1458}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-700/40 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 xl:pr-0">
        <div className="w-full px-6 lg:w-1/2 lg:px-0 animate-fade-in">
          <h1
            id="careers-hero-heading"
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Build the Future of Trust
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            We&apos;re a mission-driven team innovating at the intersection of
            AI, data, and community to build the world&apos;s most trusted
            platform for consumer insights. Come build with us.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <a
                href="#open-positions"
                className="inline-flex items-center gap-2"
                aria-label="View open roles at Revuoo"
              >
                <Briefcase className="h-5 w-5" />
                View Open Roles
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
