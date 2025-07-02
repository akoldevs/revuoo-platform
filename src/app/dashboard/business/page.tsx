// src/app/dashboard/business/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitResponse } from './actions';
import { Edit, GalleryHorizontal } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BusinessDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?message=You must be logged in to view this page.');
  }

  const { data: business } = await supabase
    .from('businesses')
    .select(`
      id, 
      name, 
      reviews (
        id, 
        created_at, 
        title, 
        summary, 
        overall_rating, 
        profiles (full_name)
      )
    `)
    .eq('owner_id', user.id)
    .order('created_at', { referencedTable: 'reviews', ascending: false })
    .single();

  if (!business) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Business Profile Found</h1>
        <p>Your account is not associated with a business profile.</p>
        <p className="mt-2 text-sm text-gray-600">Please find your business on Revuoo and use the "Claim Profile" button.</p>
        <Button asChild className="mt-4">
          <Link href="/reviews">Explore Businesses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="border-b pb-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold">Business Dashboard</h1>
              <p className="mt-2 text-2xl text-indigo-600">{business.name}</p>
            </div>
            {/* --- THIS IS THE NEW BUTTON --- */}
            <Button asChild variant="outline">
              <Link href="/dashboard/business/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            {/* --- THIS IS THE NEW BUTTON --- */}
      <Button asChild variant="outline">
        <Link href="/dashboard/business/gallery">
          <GalleryHorizontal className="mr-2 h-4 w-4" />
          Manage Gallery
        </Link>
      </Button>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-6">Customer Reviews</h2>
      <div className="space-y-8">
        {business.reviews && business.reviews.length > 0 ? (
          business.reviews.map((review) => (
            <Card key={review.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{review.title}</CardTitle>
                  {review.overall_rating && ( <Badge>{review.overall_rating.toFixed(1)} ★</Badge> )}
                </div>
                <CardDescription>
                  By {review.profiles?.full_name || 'Anonymous'} on {format(new Date(review.created_at), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic">"{review.summary}"</p>
              </CardContent>
              <CardContent>
                 <h4 className="font-semibold mb-2">Leave a Public Response</h4>
                 <form action={submitResponse}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="businessId" value={business.id} />
                    <Textarea name="responseText" placeholder="Thank your customer or address their concerns..." className="mb-2" />
                    <Button type="submit" size="sm">Post Response</Button>
                 </form>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="py-10 text-center text-gray-500">You have not received any reviews yet.</p>
        )}
      </div>
    </div>
  );
}