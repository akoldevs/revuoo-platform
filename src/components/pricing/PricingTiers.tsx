"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Define the type for a plan object, matching our database structure
type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_annually: number;
  is_most_popular: boolean;
};

// Define the type for the features, which we'll still get from the static file for now
type Feature = {
  name: string;
  tiers: { [key: string]: boolean | string };
  tooltip?: string;
};

export function PricingTiers({
  plans,
  features,
}: {
  plans: Plan[];
  features: { category: string; items: Feature[] }[];
}) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="space-y-12">
      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <Label
          htmlFor="billing-cycle"
          className={!isAnnual ? "font-bold text-primary" : ""}
        >
          Monthly
        </Label>
        <Switch
          id="billing-cycle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <Label
          htmlFor="billing-cycle"
          className={isAnnual ? "font-bold text-primary" : ""}
        >
          Annually{" "}
          <Badge variant="secondary" className="ml-2">
            Save 20%
          </Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10",
              plan.is_most_popular ? "ring-2 ring-primary" : ""
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {plan.name}
                </h3>
                {plan.is_most_popular && (
                  <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                    Most popular
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>
              <div className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {plan.slug === "enterprise"
                    ? "Custom"
                    : `$${isAnnual ? plan.price_annually : plan.price_monthly}`}
                </span>
                {plan.slug !== "free" && plan.slug !== "enterprise" && (
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /month
                  </span>
                )}
              </div>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {features
                  .flatMap((f) => f.items)
                  .map((feature) => {
                    const featureTier = feature.tiers[plan.name];
                    if (featureTier) {
                      return (
                        <li key={feature.name} className="flex gap-x-3">
                          <Check
                            className="h-6 w-5 flex-none text-primary"
                            aria-hidden="true"
                          />
                          {feature.name}
                          {typeof featureTier === "string" && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({featureTier})
                            </span>
                          )}
                        </li>
                      );
                    }
                    return null;
                  })}
              </ul>
            </div>
            <Link
              href={
                plan.slug === "enterprise" ? "/contact-sales" : "/get-started"
              }
              className={cn(
                "mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                plan.is_most_popular
                  ? "bg-primary text-white shadow-sm hover:bg-primary/80 focus-visible:outline-primary"
                  : "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:outline-primary"
              )}
            >
              {plan.slug === "enterprise"
                ? "Contact Sales"
                : `Choose ${plan.name}`}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
