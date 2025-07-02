// src/app/write-a-review/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'; // Corrected path
import { notFound } from 'next/navigation';
import ReviewForm from '../ReviewForm'; // Corrected path

// This function fetches the business ID and name from the slug
async function getBusiness(slug: string) {
  const supabase = await createClient(); // <-- THE FINAL FIX IS HERE
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function WriteReviewPage({ params }: { params: { slug: string } }) {
  const business = await getBusiness(params.slug);

  // If no business matches the slug, show a 404 page
  if (!business) {
    notFound();
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="w-full max-w-3xl mx-auto px-6">
        {/* We pass the business details to the form component */}
        <ReviewForm businessId={business.id} businessName={business.name} />
      </div>
    </div>
  );
}