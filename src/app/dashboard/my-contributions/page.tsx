// src/app/dashboard/my-contributions/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CredibilityCard from "@/components/dashboard/CredibilityCard";

export default async function MyContributionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch the user's profile to get their credibility score
  const { data: profile } = await supabase
    .from("profiles")
    .select("credibility_score")
    .eq("id", user.id)
    .single();

  const credibilityScore = profile?.credibility_score || 0;

  return (
    <div>
      <div className="border-b pb-6 mb-8">
        <h1 className="text-4xl font-bold">My Contributions</h1>
        <p className="mt-2 text-lg text-gray-600">
          Track your community impact, credibility, and earned badges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* We will add Comments and Q&A sections here later */}
          <div className="bg-white p-8 rounded-lg border">
            <h2 className="text-xl font-semibold">My Comments</h2>
            <p className="mt-4 text-gray-500">
              [A list of the user&apos;s comments will be built here.]
            </p>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1">
          <CredibilityCard score={credibilityScore} />
          {/* We will add the Badge Showcase component here later */}
        </div>
      </div>
    </div>
  );
}
