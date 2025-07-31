// src/components/admin/ContentAnalytics.tsx
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { client as sanityClient } from "@/lib/sanity/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Eye } from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Metadata } from "next";
// ✅ FIX: Imported the 'groq' tagged template literal from next-sanity.
import { groq } from "next-sanity";

// --- TypeScript Interfaces ---
type SanityPost = {
  _id: string;
  title: string;
  slug: { current: string };
};

// --- Data Fetching Queries ---
const blogPostsQuery = groq`*[_type == "post"]{_id, title, slug}`;

export const metadata: Metadata = {
  title: "Sitemap | Revuoo",
  description:
    "Navigate Revuoo with ease. Explore categories, reviews, guides, and business tools from one central hub.",
};

export async function ContentAnalytics() {
  noStore();

  const supabase = await createSupabaseClient();

  const [posts, analyticsData] = await Promise.all([
    sanityClient.fetch<SanityPost[]>(blogPostsQuery),
    supabase.from("content_analytics").select("id, view_count"),
  ]);

  if (analyticsData.error) {
    console.error("Error fetching analytics:", analyticsData.error);
  }

  const analyticsMap = new Map(
    (analyticsData.data || []).map((a) => [a.id, a.view_count])
  );

  const postsWithViews = posts
    .map((post) => ({
      ...post,
      views: analyticsMap.get(post._id) || 0,
    }))
    .sort((a, b) => b.views - a.views);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" /> Content Performance
        </CardTitle>
        <CardDescription>
          Page view analytics for all published guides and insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article Title</TableHead>
                <TableHead className="text-right w-[120px]">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postsWithViews && postsWithViews.length > 0 ? (
                postsWithViews.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className="hover:underline"
                        target="_blank"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg flex items-center justify-end gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      {post.views.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    No analytics data yet. Views will be tracked as users visit
                    your blog posts.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
