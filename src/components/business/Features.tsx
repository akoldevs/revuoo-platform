// src/components/business/Features.tsx

"use client";

import {
  CheckCircle2,
  Bot,
  SlidersHorizontal,
  Star,
  BarChartBig,
  Eye,
} from "lucide-react";
import type { ReactNode, FC } from "react";

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureItem: FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="relative pl-14">
    <dt className="text-lg font-semibold text-gray-900 flex items-center gap-3">
      <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
        {icon}
      </div>
      {title}
    </dt>
    <dd className="mt-2 text-base text-gray-600 leading-7">{description}</dd>
  </div>
);

export default function Features() {
  const features: FeatureItemProps[] = [
    {
      icon: <Star className="h-5 w-5 text-white" />,
      title: "Showcase Your Excellence",
      description:
        "Manage your profile, add photos, list services, and show customers what makes you great.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-white" />,
      title: "Collect Verified Reviews",
      description:
        "Utilize our invitation tools to gather authentic feedback from real customers, marked with a 'Verified' badge.",
    },
    {
      icon: <Bot className="h-5 w-5 text-white" />,
      title: "AI-Powered Insights",
      description:
        "Go beyond star ratings with sentiment analysis and topic modeling to truly understand what your customers are saying.",
    },
    {
      icon: <BarChartBig className="h-5 w-5 text-white" />,
      title: "Powerful Analytics",
      description:
        "Track profile views, engagement, and the impact of your reviews with a simple, intuitive dashboard.",
    },
    {
      icon: <Eye className="h-5 w-5 text-white" />,
      title: "Boost Your Visibility",
      description:
        "Improve your online presence with a trusted third-party profile that ranks in search engines.",
    },
    {
      icon: <SlidersHorizontal className="h-5 w-5 text-white" />,
      title: "Engage & Respond",
      description:
        "Publicly respond to reviews to show you care, resolve issues, and thank your loyal customers.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-gray-50 py-24 sm:py-32"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            Your Reputation Toolkit
          </p>
          <h2
            id="features-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Everything you need to build trust
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From collecting reviews to gaining deep customer insights, our
            platform provides the tools to enhance your brand&apos;s presence
            and credibility.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <FeatureItem
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
