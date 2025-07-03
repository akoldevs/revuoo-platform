// src/app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { approveReview, rejectReview, approveResponse, rejectResponse } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Bot } from 'lucide-react';

export const dynamic = 'force-dynamic';

const getSafetyBadgeVariant = (status: string | undefined): "default" | "destructive" | "secondary" => {
    switch (status) {
      case 'SAFE': return 'default';
      case 'FLAGGED': return 'destructive';
      default: return 'secondary';
    }
};

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    // We will use a proper notFound() call from Next.js later
    return <div>Not Authorized</div>;
  }

  const pendingReviewsPromise = supabase.from('reviews').select(`*, businesses (name), profiles (full_name), review_ai_analysis (*)`).eq('status', 'pending').order('created_at', { ascending: true });
  const pendingResponsesPromise = supabase.from('business_responses').select(`*, businesses (name), reviews (title)`).eq('status', 'pending').order('created_at', { ascending: true });

  const [{ data: pendingReviews }, { data: pendingResponses }] = await Promise.all([ pendingReviewsPromise, pendingResponsesPromise ]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-lg text-gray-600">Content Moderation Queue</p>

      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold">Pending Reviews ({pendingReviews?.length || 0})</h2>
        {pendingReviews && pendingReviews.length > 0 ? (
          pendingReviews.map((review: any) => {
            const aiAnalysis = Array.isArray(review.review_ai_analysis) ? review.review_ai_analysis[0] : review.review_ai_analysis;
            return (
              <Card key={`review-${review.id}`} className="bg-white border-yellow-400">
                <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{review.title}</CardTitle>
                      <Badge variant="secondary">PENDING</Badge>
                    </div>
                    <CardDescription>For Business: <span className="font-bold text-indigo-600">{review.businesses?.name || 'N/A'}</span><br/>By: <span className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</span> on {format(new Date(review.created_at), 'MMM d, yyyy')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="italic bg-gray-50 p-4 rounded-md mb-6">{review.summary}</p>
                    {aiAnalysis && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3 flex items-center text-lg"><Bot className="mr-2 h-5 w-5 text-gray-600" /> AI-Assisted Moderation</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 text-sm">
                           <div><span className="font-semibold">Safety: </span> <Badge variant={getSafetyBadgeVariant(aiAnalysis.safety_rating)}>{aiAnalysis.safety_rating || 'N/A'}</Badge></div>
                           <p><span className="font-semibold">Reasoning:</span> {aiAnalysis.reasoning || <span className="italic text-gray-500">N/A (Review appears safe)</span>}</p>
                           <p><span className="font-semibold">Sentiment:</span> {aiAnalysis.sentiment}</p>
                           <p><span className="font-semibold">AI Summary:</span> <span className="italic">&quot;{aiAnalysis.summary}&quot;</span></p>
                        </div>
                      </div>
                    )}
                </CardContent>
                <CardFooter className="flex gap-4 border-t pt-4 mt-4">
                    <form action={approveReview}><input type="hidden" name="reviewId" value={review.id} /><Button type="submit" variant="default" size="sm">Approve</Button></form>
                    <form action={rejectReview}><input type="hidden" name="reviewId" value={review.id} /><Button type="submit" variant="destructive" size="sm">Reject</Button></form>
                </CardFooter>
              </Card>
            );
          })
        ) : (<p className="text-gray-500 py-10 text-center">No pending reviews. Great job!</p>)}
      </div>

      <div className="mt-12 pt-8 border-t space-y-6">
        <h2 className="text-2xl font-semibold">Pending Business Responses ({pendingResponses?.length || 0})</h2>
        {pendingResponses && pendingResponses.length > 0 ? (
          pendingResponses.map((response: any) => (
            <Card key={`response-${response.id}`} className="bg-white border-blue-400">
              <CardHeader>
                <CardTitle>Response to: &quot;{response.reviews?.title}&quot;</CardTitle>
                <CardDescription>For Business: <span className="font-bold text-indigo-600">{response.businesses?.name}</span></CardDescription>
              </CardHeader>
              <CardContent><p className="italic bg-gray-50 p-4 rounded-md">{response.response_text}</p></CardContent>
              <CardFooter className="flex gap-4">
                 <form action={approveResponse}><input type="hidden" name="responseId" value={response.id} /><Button type="submit" variant="default" size="sm">Approve Response</Button></form>
                  <form action={rejectResponse}><input type="hidden" name="responseId" value={response.id} /><Button type="submit" variant="destructive" size="sm">Reject Response</Button></form>
              </CardFooter>
            </Card>
          ))
        ) : (<p className="text-gray-500 py-10 text-center">No pending business responses.</p>)}
      </div>
    </div>
  );
}