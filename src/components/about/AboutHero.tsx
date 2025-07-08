// src/components/about/AboutHero.tsx

import { ArrowDown } from "lucide-react";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative bg-gray-900 h-[80vh] min-h-[700px] flex items-center justify-center text-center">
      {/* Background Image with Dark Overlay */}
      <Image
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
        alt="A diverse team collaborating in a modern office"
        fill
        priority
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Empowering Smarter Decisions,
          <br /> One Verified Review at a Time.
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300">
          We&apos;re building the most trusted platform for real insights,
          connecting you with businesses and services that truly deliver.
        </p>

        {/* Optional CTA to scroll down */}
        <div className="mt-12">
          <a
            href="#the-difference"
            className="inline-flex flex-col items-center text-white group animate-bounce"
          >
            <span className="text-sm font-medium">
              See How We&apos;re Different
            </span>
            <ArrowDown className="h-6 w-6 mt-1 transition-transform group-hover:translate-y-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
