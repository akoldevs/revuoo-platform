// src/app/dashboard/business/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import the button

export const dynamic = 'force-dynamic';

export default async function BusinessDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (!business) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">No Business Profile Found</h1>
        <p>You have not claimed a business profile yet.</p>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
          Find a business to claim
        </Link>
      </div>
    )
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <h2 className="text-xl text-gray-600">Managing: {business.name}</h2>
        </div>
        {/* --- NEW PART --- */}
        <Link href="/dashboard/business/edit">
          <Button variant="outline">Edit Profile</Button>
        </Link>
        {/* --- END OF NEW PART --- */}
      </div>

      <h3 className="text-2xl font-semibold border-b pb-4 mb-6">Reviews for Your Business</h3>
      
      <div className="space-y-8">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border p-4 rounded-lg">
              <p className="font-bold text-lg">{review.title}</p>
              <p className="text-sm text-gray-500 mb-2">Overall Rating: {review.overall_rating} / 5</p>
              <p>{review.summary}</p>
            </div>
          ))
        ) : (
          <p>Your business has no reviews yet.</p>
        )}
      </div>
    </div>
  );
}