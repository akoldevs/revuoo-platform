// src/app/leave-a-review/[token]/page.tsx

// ✅ FIX: Removed the unnecessary "use server" directive.
// Page files in the App Router are Server Components by default.

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReviewForm from "@/components/forms/ReviewForm";

// Type we're expecting from RPC
type BusinessFromToken = {
  id: number;
  name: string;
  slug: string;
};

// ✅ FIX: Removed the problematic export.
// Dynamic rendering is the default for pages that fetch data like this.
// export const dynamic = "force-dynamic";

export default async function LeaveAReviewViaTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_business_from_invitation_token",
    { p_token: params.token }
  );

  const business = Array.isArray(data) ? (data[0] as BusinessFromToken) : null;

  if (error || !business) {
    console.error("Token lookup failed:", error);
    notFound();
  }

  return (
    <main className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <ReviewForm businessId={business.id} businessName={business.name} />
      </div>
    </main>
  );
}
