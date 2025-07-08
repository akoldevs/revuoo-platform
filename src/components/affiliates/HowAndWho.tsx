"use client";

import { Check } from "lucide-react";

const steps = [
  {
    name: "Apply",
    description:
      "Fill out our short application form—it takes less than 2 minutes.",
  },
  {
    name: "Get Approved",
    description:
      "Our team will review your application and approve qualified partners within 48 hours.",
  },
  {
    name: "Promote Revuoo",
    description:
      "Get your unique tracking links, banners, and content templates from your affiliate dashboard.",
  },
  {
    name: "Earn Commissions",
    description:
      "Track your referrals in real time and receive reliable monthly payouts.",
  },
];

const whoFor = [
  "Marketing agencies & consultants",
  "SaaS review sites & tech bloggers",
  "Web developers & digital freelancers",
  "Business influencers & community leaders",
  "Professional associations & B2B networks",
];

export default function HowAndWho() {
  return (
    <section
      className="bg-white py-24 sm:py-32"
      aria-labelledby="how-and-who-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-2 lg:items-start lg:gap-x-16">
          {/* Column 1: How It Works */}
          <div className="max-w-2xl">
            <p className="text-base font-semibold text-indigo-600">
              How It Works
            </p>
            <h2
              id="how-and-who-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Start Earning in 4 Simple Steps
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Joining our affiliate program is straightforward and transparent.
              Follow these simple steps to start earning.
            </p>
            <dl className="mt-10 space-y-8">
              {steps.map((step, index) => (
                <div
                  key={step.name}
                  className="relative flex items-start gap-x-4 animate-fade-in"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold text-base shadow">
                    {index + 1}
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">{step.name}</dt>
                    <dd className="mt-1 text-base leading-7 text-gray-600">
                      {step.description}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <a
                href="#apply"
                className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Apply Now
              </a>
            </div>
          </div>

          {/* Column 2: Who It’s For */}
          <div className="rounded-lg bg-gray-50 p-8 shadow-sm">
            <p className="text-base font-semibold text-indigo-600">
              Who It’s For
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              Perfect Partners for Revuoo
            </h3>
            <p className="mt-4 text-gray-600">
              If you have an audience of businesses, you’re a perfect fit. We
              welcome:
            </p>
            <ul role="list" className="mt-6 space-y-3">
              {whoFor.map((item) => (
                <li key={item} className="flex gap-x-3">
                  <Check className="h-5 w-5 flex-none text-indigo-600" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
