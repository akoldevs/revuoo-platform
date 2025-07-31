"use client";

import { useState, useMemo } from "react";
import { Check, X, Search } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// ❌ We no longer import static data.
// import { plans, features } from "@/lib/pricing-data";

// ✅ Define the types for the props we will receive.
type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_annually: number;
  is_most_popular: boolean;
};

type Feature = {
  name: string;
  tiers: { [key: string]: boolean | string };
  tooltip?: string;
};

type FeatureCategory = {
  category: string;
  items: Feature[];
};

interface PricingTableProps {
  billingCycle: "monthly" | "annually";
  plans: Plan[];
  features: FeatureCategory[];
}

export default function PricingTable({
  billingCycle,
  plans,
  features,
}: PricingTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getFeaturesForPlan = (planName: string) => {
    const planFeatures: string[] = [];
    features.forEach((category) => {
      category.items.forEach((item) => {
        const tierValue = item.tiers[planName as keyof typeof item.tiers];
        if (tierValue === true) {
          planFeatures.push(item.name);
        }
      });
    });
    return planFeatures.slice(0, 5);
  };

  const filteredFeatures = useMemo(() => {
    if (!searchTerm.trim()) return features;
    const term = searchTerm.toLowerCase();
    return features
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLowerCase().includes(term)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [searchTerm, features]);

  return (
    <section
      aria-labelledby="pricing-table-heading"
      className="isolate overflow-hidden bg-gray-50"
    >
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:pt-16 lg:px-8">
        <h2 id="pricing-table-heading" className="sr-only">
          Pricing Plans
        </h2>

        {/* ✅ The component now maps over the 'plans' prop */}
        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4 transition-all duration-500">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-3xl p-8 flex flex-col transition-shadow duration-300 hover:shadow-md",
                plan.is_most_popular
                  ? "bg-white ring-2 ring-indigo-600"
                  : "bg-gray-50 ring-1 ring-gray-200"
              )}
              role="region"
              aria-labelledby={`plan-${plan.name.toLowerCase()}-title`}
            >
              <h3
                id={`plan-${plan.name.toLowerCase()}-title`}
                className="text-lg font-semibold leading-8 text-gray-900"
              >
                {plan.name}
              </h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1 transition-all duration-300 ease-in-out">
                {plan.name === "Enterprise" ? (
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {/* ✅ Prices are now read from the dynamic plan object */}
                      $
                      {billingCycle === "monthly"
                        ? plan.price_monthly
                        : plan.price_annually}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  </>
                )}
              </p>
              <Button
                asChild
                className="mt-6 w-full"
                size="lg"
                variant={plan.is_most_popular ? "default" : "outline"}
              >
                <a
                  href={plan.name === "Enterprise" ? "/contact" : "#"}
                  aria-label={`Select ${plan.name} plan`}
                >
                  {/* This can be customized later if needed */}
                  Choose Plan
                </a>
              </Button>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600 flex-grow"
              >
                {getFeaturesForPlan(plan.name).map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="h-6 w-6 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Compare All Features Button */}
        <div className="mt-12 text-center">
          <Button variant="ghost" onClick={() => setShowModal(true)}>
            Compare all features →
          </Button>
        </div>

        {/* Modal */}
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          className="relative z-50"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-6xl rounded-lg bg-white p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Full Feature Comparison
                </Dialog.Title>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search bar */}
              <div className="relative mb-6 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Feature table */}
              <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full text-sm text-left border-t border-gray-200">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="py-2 pr-4 font-semibold text-gray-700">
                        Feature
                      </th>
                      {plans.map((plan) => (
                        <th
                          key={plan.name}
                          className="py-2 px-4 text-center font-semibold text-gray-700"
                        >
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeatures.map((category) =>
                      category.items.map((item) => (
                        <tr
                          key={item.name}
                          className="border-t border-gray-100"
                        >
                          <td className="py-2 pr-4 text-gray-600">
                            {item.name}
                          </td>
                          {plans.map((plan) => (
                            <td
                              key={plan.name}
                              className="py-2 px-4 text-center"
                            >
                              {item.tiers[
                                plan.name as keyof typeof item.tiers
                              ] ? (
                                <Check className="h-5 w-5 text-indigo-600 inline" />
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </section>
  );
}
