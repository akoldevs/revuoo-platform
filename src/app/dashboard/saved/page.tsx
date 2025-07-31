// src/app/dashboard/saved/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BusinessCard from "@/components/business/BusinessCard"; // Reusing our existing component!

export const dynamic = "force-dynamic";

// Define a specific type for a business object.
type Business = {
  // FIX: Changed 'id' from 'number' to 'string' to match the type
  // expected by the BusinessCard component.
  id: string;
  name: string;
  slug: string;
  description: string | null;
  revuoo_score: number | null;
};

// Define the shape of the data returned from the 'saved_businesses' table.
type SavedItem = {
  businesses: Business | null; // The related business can be null
};

export default async function SavedItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch all businesses that the current user has saved and apply our types.
  const { data: savedItems, error } = await supabase
    .from("saved_businesses")
    .select(
      `
        businesses (
          id,
          name,
          slug,
          description,
          revuoo_score
        )
      `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<SavedItem[]>();

  if (error) {
    console.error("Error fetching saved businesses:", error);
  }

  // Properly extract the nested business objects and filter out any nulls.
  const businesses =
    savedItems?.map((item) => item.businesses).filter(Boolean) || [];

  return (
    <div>
      <div className="border-b pb-6 mb-8">
        <h1 className="text-4xl font-bold">My Saved Items</h1>
        <p className="mt-2 text-lg text-gray-600">
          A collection of businesses and services you&apos;re interested in.
        </p>
      </div>

      <div className="space-y-6">
        {businesses && businesses.length > 0 ? (
          businesses.map(
            (business) =>
              // The 'business' object is now correctly typed.
              business && <BusinessCard key={business.id} business={business} />
          )
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border">
            <h3 className="text-xl font-semibold text-gray-900">
              Your Watchlist is Empty
            </h3>
            <p className="mt-2 text-gray-600">
              You haven&apos;t saved any businesses yet. Start exploring to
              create your list!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
