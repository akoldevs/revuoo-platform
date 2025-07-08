// src/components/about/OurValues.tsx

"use client";

import { ShieldCheck, Eye, Zap, Lightbulb, Users } from "lucide-react";
import type { ReactNode } from "react";

interface ValueProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const ValueCard = ({ icon, title, description }: ValueProps) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-x-4">
      <div
        className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold leading-7 text-gray-900">{title}</h3>
    </div>
    <p className="mt-4 text-base leading-7 text-gray-600">{description}</p>
  </div>
);

export default function OurValues() {
  const values: ValueProps[] = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />,
      title: "Authenticity",
      description:
        "We are committed to real reviews from real people, rigorously verifying submissions to ensure absolute integrity.",
    },
    {
      icon: <Eye className="h-6 w-6 text-indigo-600" />,
      title: "Transparency",
      description:
        "We operate with openness, clearly explaining our processes, data analysis, and the 'why' behind our Revuoo Score.",
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      title: "Empowerment",
      description:
        "We empower consumers with knowledge to make informed decisions and businesses with insights to grow through genuine feedback.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-indigo-600" />,
      title: "Innovation",
      description:
        "We leverage cutting-edge AI and human expertise to constantly enhance our platform, delivering deeper insights and smarter tools.",
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Community",
      description:
        "We foster a vibrant, respectful community where honest dialogue and mutual growth are prioritized for everyone.",
    },
  ];

  return (
    <section
      className="bg-gray-50 py-24 sm:py-32"
      aria-labelledby="our-values-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:mx-0">
          <h2
            id="our-values-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Our Core Values
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            The pillars of trust and transparency that guide every decision we
            make.
          </p>
        </div>

        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-left sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {values.map(({ icon, title, description }) => (
            <ValueCard
              key={title}
              icon={icon}
              title={title}
              description={description}
            />
          ))}
        </dl>
      </div>
    </section>
  );
}
