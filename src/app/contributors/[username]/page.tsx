// src/app/contributors/[username]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Eye, FileText, Star } from "lucide-react";
import { format } from "date-fns";

// Explicitly opt into dynamic rendering to resolve any caching issues or warnings.
export const dynamic = "force-dynamic";

// Define the specific shape of our data based on the SQL function's return type
type ContributorShowcaseData = {
  profile: {
    full_name: string;
    username: string;
    avatar_url: string | null;
    bio: string | null;
  };
  badges: {
    name: string;
    description: string;
    icon_svg: string | null;
    earned_at: string;
  }[];
  reviews: {
    id: string;
    title: string;
    summary: string | null;
    published_at: string;
    rating: number;
  }[];
};

// A helper component to render the correct icon for each badge
const BadgeIcon = ({ name }: { name: string }) => {
  const lowerCaseName = name.toLowerCase();
  if (lowerCaseName.includes("saas")) return <Star className="h-8 w-8" />;
  if (lowerCaseName.includes("first")) return <Award className="h-8 w-8" />;
  if (lowerCaseName.includes("master")) return <Eye className="h-8 w-8" />;
  if (lowerCaseName.includes("home")) return <FileText className="h-8 w-8" />;
  if (lowerCaseName.includes("automotive"))
    return <FileText className="h-8 w-8" />;
  if (lowerCaseName.includes("wellness"))
    return <FileText className="h-8 w-8" />;
  return <Star className="h-8 w-8" />; // Default icon
};

export default async function ContributorShowcasePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();

  // This is the most robust way to fetch and type the data from the RPC.
  const { data: showcaseData, error } = await supabase
    .rpc("get_public_contributor_profile", { p_username: params.username })
    .returns<ContributorShowcaseData | null>() // Explicitly type the expected return
    .single();

  // If the function returns an error OR returns null (user not found), show the 404 page.
  if (error || !showcaseData) {
    console.error("Error or no data for contributor:", params.username, error);
    return notFound();
  }

  const { profile, badges, reviews } = showcaseData;

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage
              src={profile.avatar_url || undefined}
              alt={profile.full_name}
            />
            <AvatarFallback className="text-3xl">
              {profile.full_name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold">{profile.full_name}</h1>
            <p className="text-lg text-muted-foreground">@{profile.username}</p>
            <p className="mt-2 text-foreground/80">
              {profile.bio || "This contributor has not added a bio yet."}
            </p>
          </div>
        </div>

        <div className="my-12">
          <h2 className="text-2xl font-bold mb-4">Achievements</h2>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <Card key={badge.name} className="text-center p-4">
                  <div className="flex justify-center text-primary mb-2">
                    <BadgeIcon name={badge.name} />
                  </div>
                  <h3 className="font-semibold text-card-foreground">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {badge.description}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No badges earned yet.</p>
          )}
        </div>

        <div className="my-12">
          <h2 className="text-2xl font-bold mb-4">Recent Expert Reviews</h2>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Published on{" "}
                        {format(new Date(review.published_at), "MMMM d, yyyy")}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90">{review.summary}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">
                This contributor has not published any reviews yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
