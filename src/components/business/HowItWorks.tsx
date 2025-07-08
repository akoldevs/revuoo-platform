// src/components/business/HowItWorks.tsx

"use client";

import { Award, MessageSquareHeart, BarChart3 } from "lucide-react";
import type { ReactNode, FC } from "react";

interface StepCardProps {
  step: number;
  icon: ReactNode;
  title: string;
  description: string;
}

const StepCard: FC<StepCardProps> = ({ step, icon, title, description }) => (
  <div className="text-center flex flex-col items-center">
    <div className="relative mb-4">
      <div className="bg-gray-100 p-6 rounded-full flex items-center justify-center h-20 w-20 relative">
        <span className="absolute inset-0 flex items-center justify-center font-bold text-white bg-indigo-600 rounded-full h-8 w-8 text-sm shadow -bottom-2 -right-2">
          {step}
        </span>
        {icon}
      </div>
    </div>
    <h3 className="font-bold text-lg mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600 text-base leading-6">{description}</p>
  </div>
);

export default function HowItWorks() {
  const steps: StepCardProps[] = [
    {
      step: 1,
      icon: <Award className="h-10 w-10 text-indigo-600" />,
      title: "Claim Your Profile",
      description:
        "Secure your free business profile and customize it with your information, photos, and services.",
    },
    {
      step: 2,
      icon: <MessageSquareHeart className="h-10 w-10 text-indigo-600" />,
      title: "Gather Verified Reviews",
      description:
        "Use our simple tools to invite your customers to leave authentic, verified reviews on your page.",
    },
    {
      step: 3,
      icon: <BarChart3 className="h-10 w-10 text-indigo-600" />,
      title: "Engage & Grow",
      description:
        "Respond to reviews, analyze customer feedback with our AI insights, and watch your reputation grow.",
    },
  ];

  return (
    <section
      className="bg-white py-24 sm:py-32"
      aria-labelledby="how-it-works-heading"
    >
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          >
            Get Started in 3 Easy Steps
          </h2>
          <p className="text-lg text-gray-600">
            Launch your Revuoo presence and start building trust in minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-8">
          {steps.map((step) => (
            <StepCard
              key={step.step}
              step={step.step}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
