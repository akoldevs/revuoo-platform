// src/app/dashboard/my-reviews/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation'; // Removed notFound import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { deleteReview } from './actions'; // Import our new delete action

export const dynamic = 'force-dynamic';

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'approved':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default async function MyReviewsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?message=You must be logged in to view this page.');
  }

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      id, created_at, title, overall_rating, status,
      businesses ( name, slug )
    `)
    .eq('author_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user&apos;s reviews:", error);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="border-b pb-6 mb-8">
        <h1 className="text-4xl font-bold">My Reviews</h1>
        <p className="mt-2 text-lg text-gray-600">Manage all the reviews you&apos;ve submitted.</p>
      </div>

      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="w-full">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
                  <div>
                    <CardTitle className="text-xl">{review.title}</CardTitle>
                    <CardDescription className="pt-1">
                      For: <Link href={`/business/${review.businesses?.slug}`} className="font-semibold text-indigo-600 hover:underline">{review.businesses?.name}</Link>
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(review.status)} className="w-fit">
                    {review.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Submitted on {format(new Date(review.created_at), 'MMM d, yyyy')}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/my-reviews/edit/${review.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  {/* This form wraps the delete button to call the server action */}
                  <form action={deleteReview}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <Button type="submit" variant="destructive" size="sm">
                       <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold">You haven&apos;t written any reviews yet.</h3>
            <p className="text-gray-600 mt-2 mb-4">Share your experience to help the community.</p>
            <Button asChild>
              <Link href="/write">Write Your First Review</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}