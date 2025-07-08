// src/components/about/OurMission.tsx

"use client";

import { CheckCircle2, Bot, Gauge } from "lucide-react";

const features = [
  {
    title: "Rigorous Verification.",
    description:
      "We prioritize reviews backed by proof of purchase to ensure you're reading about real experiences.",
    icon: CheckCircle2,
  },
  {
    title: "The Revuoo Score.",
    description:
      "Our proprietary score goes beyond simple ratings, analyzing multiple factors to give you a true measure of trust.",
    icon: Gauge,
  },
  {
    title: "AI-Powered Insights.",
    description:
      "We leverage cutting-edge AI to summarize feedback and identify key themes, saving you time and effort.",
    icon: Bot,
  },
];

export default function OurMission() {
  return (
    <section
      className="bg-white py-24 sm:py-32"
      aria-labelledby="our-mission-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-start">
          {/* Text Content */}
          <div className="lg:pr-4">
            <h2
              id="our-mission-heading"
              className="text-base font-semibold leading-7 text-indigo-600"
            >
              Our Mission
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Clarity in a Complex World
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Our mission is to empower smarter decisions by providing the
              world&apos;s most trusted, transparent, and insightful platform
              for reviews and recommendations. We believe everyone deserves
              access to authentic information to choose the best services and
              products for their needs.
            </p>
          </div>

          {/* Feature List */}
          <div className="flex flex-col gap-y-10">
            <dl className="space-y-10">
              {features.map(({ title, description, icon: Icon }) => (
                <div key={title} className="relative pl-9">
                  <dt className="font-semibold text-gray-900">
                    <Icon
                      className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                      aria-hidden="true"
                    />
                    {title}
                  </dt>
                  <dd className="mt-2 text-gray-600">{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
