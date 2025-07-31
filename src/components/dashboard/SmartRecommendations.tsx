// src/components/dashboard/SmartRecommendations.tsx
"use client";

import BusinessCard from "@/components/business/BusinessCard";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  revuoo_score: number | null;
}

interface RecommendationData {
  businesses: Business[] | null;
}

export default function SmartRecommendations({
  data,
}: {
  data: RecommendationData;
}) {
  const recommended = data?.businesses;

  if (!recommended || recommended.length === 0) {
    return (
      <section
        className="mt-8 p-8 bg-white rounded-lg border"
        aria-labelledby="revuoo-discover-title"
      >
        <h2 id="revuoo-discover-title" className="text-xl font-semibold">
          Discover More on Revuoo
        </h2>
        <p className="mt-4 text-gray-500">
          Write a few reviews to start getting personalized recommendations.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8" aria-labelledby="smart-recs-title">
      <h2 id="smart-recs-title" className="text-xl font-semibold">
        Smart Recommendations
      </h2>
      <div className="mt-4 space-y-4">
        {recommended.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
}
