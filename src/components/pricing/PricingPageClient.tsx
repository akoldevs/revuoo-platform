"use client";

import { useState } from "react";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingTable from "@/components/pricing/PricingTable";
import FeatureComparison from "@/components/pricing/FeatureComparison";
import BusinessFAQ from "@/components/business/BusinessFAQ";

// Define the types for the data we receive from the server
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

// This component wraps your existing pricing page structure and makes it interactive.
export function PricingPageClient({
  plans,
  features,
}: {
  plans: Plan[];
  features: FeatureCategory[];
}) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

  return (
    <main>
      <PricingHeader
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
      />
      {/* ✅ We now pass the dynamic 'plans' data to your PricingTable */}
      <PricingTable
        billingCycle={billingCycle}
        plans={plans}
        features={features}
      />
      <FeatureComparison />
      <BusinessFAQ />
    </main>
  );
}
