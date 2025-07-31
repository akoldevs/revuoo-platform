// src/app/for-businesses/plans-pricing/page.tsx
import { createClient } from "@/lib/supabase/server";
import { features } from "@/lib/pricing-data";
import { PricingPageClient } from "@/components/pricing/PricingPageClient";

// Define the type for a plan object fetched from the database
type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_annually: number;
  is_most_popular: boolean;
};

export const dynamic = "force-dynamic";

// This is now a Server Component that fetches data
export default async function PlansAndPricingPage() {
  const supabase = await createClient();

  // Fetch all plan details directly from the database.
  const { data: plans, error } = await supabase.from("plans").select("*");
  // We remove the database order and will sort in the code instead.

  if (error) {
    console.error("Error fetching plans:", error);
  }

  // ✅ FIXED: Apply a custom sort order to ensure plans are always displayed correctly.
  const sortedPlans = (plans || []).sort((a, b) => {
    const order = { Free: 1, Pro: 2, Advanced: 3, Enterprise: 4 };
    return (
      (order[a.name as keyof typeof order] || 99) -
      (order[b.name as keyof typeof order] || 99)
    );
  });

  // We pass the fetched plans and the static features to a new client component
  // which will handle the interactive state (the monthly/annual toggle).
  return <PricingPageClient plans={sortedPlans} features={features} />;
}
