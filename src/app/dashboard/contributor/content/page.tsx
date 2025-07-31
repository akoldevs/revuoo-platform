// src/app/dashboard/contributor/content/page.tsx

import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpertReviewList from "@/components/contributor/ExpertReviewList";

// This type definition ensures our data is strongly typed
type SubmittedContent = {
  id: string;
  review_title: string;
  submitted_at: string;
  status: string;
  assignment_title: string;
};

export const dynamic = "force-dynamic";

export default async function MyContentPage() {
  const supabase = await createClient();

  // ✅ FIX: Fetch data more robustly without the .returns() helper
  const { data, error } = await supabase.rpc("get_my_submitted_content");

  if (error) {
    console.error("Error fetching contributor content:", error);
    // In case of an error, we'll pass an empty array to the component
  }

  // ✅ FIX: Safely assign the fetched data to our typed variable
  const expertReviews: SubmittedContent[] = data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Content</h1>
        <p className="text-muted-foreground">
          Manage all your published articles, expert reviews, and drafts.
        </p>
      </div>

      <Tabs defaultValue="expert-reviews" className="w-full">
        <TabsList>
          <TabsTrigger value="expert-reviews">Expert Reviews</TabsTrigger>
          <TabsTrigger value="guides-blogs" disabled>
            Guides & Blogs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="expert-reviews" className="mt-4">
          {/* ✅ This now receives a correctly typed and safe array */}
          <ExpertReviewList reviews={expertReviews} />
        </TabsContent>
        <TabsContent value="guides-blogs">
          {/* We will build this part later */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
