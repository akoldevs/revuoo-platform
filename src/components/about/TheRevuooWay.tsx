// src/components/about/TheRevuooWay.tsx

"use client";

import { Gauge, CheckCheck, Bot, BookOpen } from "lucide-react";
import type { ReactNode, FC } from "react";

interface DifferentiatorProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard: FC<DifferentiatorProps> = ({ icon, title, description }) => (
  <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-4 mb-4">
      <div
        className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 text-base leading-7">{description}</p>
  </div>
);

export default function TheRevuooWay() {
  const differentiators: DifferentiatorProps[] = [
    {
      icon: <Gauge className="h-7 w-7 text-indigo-600" />,
      title: "The Revuoo Score",
      description:
        "Our proprietary rating combines verified reviews, AI sentiment, and business responsiveness for a holistic, unbiased trust score.",
    },
    {
      icon: <CheckCheck className="h-7 w-7 text-indigo-600" />,
      title: "Rigorous Verification",
      description:
        "Unlike others, we don’t just show reviews; we authenticate them. Our multi-layered verification process ensures real reviews from real customers.",
    },
    {
      icon: <Bot className="h-7 w-7 text-indigo-600" />,
      title: "AI-Powered Insights",
      description:
        "Our intelligent algorithms summarize hundreds of reviews into actionable insights, helping you grasp the core sentiments and key trends instantly.",
    },
    {
      icon: <BookOpen className="h-7 w-7 text-indigo-600" />,
      title: "Expert-Crafted Guides",
      description:
        "Complementing user reviews, our in-house experts publish in-depth guides and analysis, offering a 360-degree perspective.",
    },
  ];

  return (
    <section
      id="the-difference"
      className="bg-white py-24 sm:py-32"
      aria-labelledby="revuoo-way-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="revuoo-way-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Our Mission: To Be the Global Standard for Trust
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            At Revuoo, we believe that every decision should be informed by
            genuine experiences. Our mission is to cut through the noise,
            providing a transparent and intelligent platform where individuals
            and businesses connect through the power of verified reviews and
            expert analysis.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {differentiators.map(({ icon, title, description }) => (
              <FeatureCard
                key={title}
                icon={icon}
                title={title}
                description={description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
