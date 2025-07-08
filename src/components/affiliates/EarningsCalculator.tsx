"use client";

import { DollarSign, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import EarningsCalculator from "./EarningsCalculator";
import type { FC } from "react";

type Benefit = {
  name: string;
  description: string;
  icon: FC<{ className?: string }>;
};

const benefits: Benefit[] = [
  {
    name: "Competitive Commissions",
    description:
      "Earn up to 30% recurring commission on every subscription you refer. Transparent, scalable, and built for long-term success.",
    icon: DollarSign,
  },
  {
    name: "High Conversion Rates",
    description:
      "Revuoo’s trust-building features—like verified reviews and the Revuoo Score—make it easy to convert your audience into paying customers.",
    icon: Zap,
  },
  {
    name: "Recurring Revenue",
    description:
      "Get paid monthly for every active subscription your referral maintains. The more you refer, the more your passive income grows.",
    icon: TrendingUp,
  },
  {
    name: "A Trusted Brand",
    description:
      "Partner with a platform that prioritizes authenticity, transparency, and ethical growth. Promote with confidence.",
    icon: ShieldCheck,
  },
];

export default function WhyPartner() {
  return (
    <section
      className="bg-white py-24 sm:py-32"
      aria-labelledby="why-partner-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            Why Join
          </p>
          <h2
            id="why-partner-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Unlock Growth. Build Trust. Earn Commission.
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our affiliate program is designed to be a true partnership. We
            provide the tools, support, and commission structure you need to
            succeed.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.name}
                className="flex flex-col transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-sm"
              >
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <benefit.icon
                    className="h-7 w-7 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {benefit.name}
                </dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">
                  {benefit.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <EarningsCalculator />
      </div>
    </section>
  );
}
