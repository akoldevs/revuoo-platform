// src/app/dashboard/business/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation'; // Removed notFound import
import EditBusinessForm from './EditBusinessForm';

export const dynamic = 'force-dynamic';

export default async function EditBusinessPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch the full business profile for the logged-in user
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  if (!business) {
    // If they don't own a business, they can't edit one.
    return redirect('/dashboard/business');
  }

  // Pass the full business object to the form component
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Your Business Profile</h1>
      <EditBusinessForm business={business} />
    </div>
  );
}