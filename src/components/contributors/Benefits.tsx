// src/components/contributors/Benefits.tsx

"use client";

import { DollarSign, UserCheck, Users, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

interface BenefitProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitProps) => (
  <div className="flex flex-col items-center text-center animate-fade-in">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-4 shadow-sm">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
    <p className="text-gray-600 text-base">{description}</p>
  </div>
);

export default function Benefits() {
  return (
    <section
      className="bg-white py-24 sm:py-32"
      aria-labelledby="contributor-benefits-heading"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:text-center">
          <h2
            id="contributor-benefits-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Why Write for Revuoo?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We empower our contributors with the resources and platform to make
            a real impact—and a real income.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 lg:grid-cols-4 md:gap-x-8">
            <BenefitCard
              icon={<DollarSign className="h-8 w-8 text-indigo-600" />}
              title="Earn Money"
              description="Get paid competitive rates for your high-quality expert reviews and in-depth guides."
            />
            <BenefitCard
              icon={<UserCheck className="h-8 w-8 text-indigo-600" />}
              title="Build Your Brand"
              description="Your profile and content will be seen by thousands of users seeking expert advice, establishing you as a trusted voice."
            />
            <BenefitCard
              icon={<Users className="h-8 w-8 text-indigo-600" />}
              title="Join a Community"
              description="Connect with other industry experts and the Revuoo team in our private contributor community."
            />
            <BenefitCard
              icon={<TrendingUp className="h-8 w-8 text-indigo-600" />}
              title="Make an Impact"
              description="Help people make better, more informed decisions and hold businesses to a higher standard."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
