// src/app/profile/[username]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ReviewCard from '@/components/ReviewCard';
import { format } from 'date-fns';
import { Calendar, Star, ThumbsUp, Shield } from 'lucide-react'; // <-- Import ThumbsUp and Shield
import { Review } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Update the type to include the score
type ProfileWithReviews = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
  reviews: Review[];
  credibility_score: number; // <-- Add credibility_score
};

async function getProfileData(username: string): Promise<ProfileWithReviews | null> {
  const supabase = await createClient();
  // The query now fetches all columns from profiles, including our new score
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *, 
      reviews (
        *, 
        businesses (id, name, slug)
      )
    `)
    .eq('username', username)
    .single();

  if (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
  return data;
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const profile = await getProfileData(params.username);

  if (!profile) {
    notFound();
  }

  const approvedReviews = profile.reviews.filter(review => review.status === 'approved');
  
  // --- NEW: Calculate total upvotes from all of the user's reviews ---
  const totalUpvotes = approvedReviews.reduce((acc, review) => acc + (review.upvote_count || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || profile.username} />
                <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <CardTitle className="text-3xl">{profile.full_name}</CardTitle>
                <CardDescription className="text-lg">@{profile.username}</CardDescription>
                
                {/* --- THIS IS THE NEW, ENHANCED STATS BAR --- */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1" title="Date Joined"><Calendar className="h-4 w-4" /> Member since {format(new Date(profile.updated_at), 'MMM yyyy')}</div>
                    <div className="flex items-center gap-1" title="Total Approved Reviews"><Star className="h-4 w-4" /> {approvedReviews.length} Reviews</div>
                    <div className="flex items-center gap-1" title="Total Helpful Votes Received"><ThumbsUp className="h-4 w-4" /> {totalUpvotes} Helpful Votes</div>
                    <div className="flex items-center gap-1" title="Revuoo Credibility Score"><Shield className="h-4 w-4" /> {profile.credibility_score} Credibility Score</div>
                </div>

              </div>
            </div>
          </CardHeader>
        </Card>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{profile.full_name}&apos;s Reviews</h2>
          {approvedReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">{profile.full_name} hasn&apos;t written any approved reviews yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}