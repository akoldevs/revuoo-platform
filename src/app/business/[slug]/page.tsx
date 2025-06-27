// src/app/business/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import UserReviewCard from '@/components/UserReviewCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BusinessProfilePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!business) {
    notFound();
  }

  // We add .eq('status', 'approved') to only fetch approved reviews for this business
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, business_responses(*)') // We keep fetching responses
    .eq('business_id', business.id)
    .eq('status', 'approved');

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      {/* The Business Header and Details sections remain the same... */}
      <div className="border-b pb-6 mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">{business.name}</h1>
        <p className="text-lg mt-2 text-gray-600">{business.category}</p>
        {business.website_url && (
          <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mt-1 block">
            Visit Website
          </a>
        )}
        {!business.owner_id && (
          <div className="mt-6">
            <Link href={`/claim/${business.slug}`} className="inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
              Is this your business? Claim this profile
            </Link>
          </div>
        )}
      </div>
      
      {/* ... Other sections remain the same ... */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">About {business.name}</h2>
        <div className="prose max-w-none">
          <p>{business.description}</p>
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 rounded-lg mb-12">
        <h3 className="text-xl font-semibold mb-4">Business Details</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {business.address && <div><dt className="font-medium">Address</dt><dd className="text-gray-700">{business.address}</dd></div>}
            {business.phone_number && <div><dt className="font-medium">Phone</dt><dd className="text-gray-700">{business.phone_number}</dd></div>}
            {business.business_email && <div><dt className="font-medium">Email</dt><dd className="text-gray-700">{business.business_email}</dd></div>}
            {business.year_founded && <div><dt className="font-medium">Year Founded</dt><dd className="text-gray-700">{business.year_founded}</dd></div>}
            {business.is_insured && <div><dt className="font-medium">Insurance</dt><dd className="text-green-600">Insured</dd></div>}
            {business.is_verified && <div><dt className="font-medium">Status</dt><dd className="text-green-600">Revuoo Verified</dd></div>}
        </dl>
      </div>

      {/* User Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <UserReviewCard key={review.id} review={review as any} />
            ))}
          </div>
        ) : (
          <p>This business doesn't have any approved user reviews yet.</p>
        )}
      </div>
    </div>
  );
}