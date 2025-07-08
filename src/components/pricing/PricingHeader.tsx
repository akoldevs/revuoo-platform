// src/components/pricing/PricingHeader.tsx
"use client";

import { Button } from "@/components/ui/button";

interface PricingHeaderProps {
  billingCycle: "monthly" | "annually";
  setBillingCycle: (cycle: "monthly" | "annually") => void;
}

export default function PricingHeader({
  billingCycle,
  setBillingCycle,
}: PricingHeaderProps) {
  return (
    <section aria-labelledby="pricing-heading" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 text-center">
        <h1
          id="pricing-heading"
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
        >
          Choose the Plan That Grows Your Business with Trust
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Simple, transparent pricing. No hidden fees. Cancel anytime. Upgrade
          when you&apos;re ready.
        </p>

        <div className="mt-16 flex justify-center">
          <div
            role="group"
            aria-label="Billing cycle toggle"
            className="flex rounded-lg bg-gray-100 p-1"
          >
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "annually" ? "default" : "ghost"}
              onClick={() => setBillingCycle("annually")}
              aria-pressed={billingCycle === "annually"}
            >
              Annually{" "}
              <span className="ml-1 text-sm text-green-600">(Save 20%)</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
