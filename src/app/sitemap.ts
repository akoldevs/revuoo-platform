// src/app/sitemap.ts

import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { createClient } from "@/lib/supabase/server";

const baseUrl = "https://www.revuoo.com";

interface SanityDoc {
  slug: { current: string };
  _updatedAt: string;
}

interface CategoryDoc {
  slug: string;
}

interface BusinessDoc {
  slug: string;
  updated_at: string;
}

interface ExpertReviewDoc {
  slug: string;
  updated_at: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // 1. Sanity: Blog, Help, Legal
  const sanityQuery = `*[_type in ["post", "helpArticle", "legalPage"]]{ slug, _updatedAt }`;
  const sanityDocs: SanityDoc[] = await client.fetch(sanityQuery);

  const sanityUrls = sanityDocs.map((doc) => {
    let path = "";
    if (doc.slug.current.includes("post")) path = `/blog/${doc.slug.current}`;
    else if (doc.slug.current.includes("help"))
      path = `/help/article/${doc.slug.current}`;
    else path = `/legal/${doc.slug.current}`;

    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(doc._updatedAt).toISOString(),
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  // 2. Supabase: Categories
  const { data: categories } = await supabase.from("categories").select("slug");
  const categoryUrls =
    (categories as CategoryDoc[] | null)?.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    })) || [];

  // 3. Supabase: Businesses
  const { data: businesses } = await supabase
    .from("businesses")
    .select("slug, updated_at");
  const businessUrls =
    (businesses as BusinessDoc[] | null)?.map((biz) => ({
      url: `${baseUrl}/business/${biz.slug}`,
      lastModified: new Date(biz.updated_at || new Date()).toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    })) || [];

  // 4. Supabase: Expert Reviews (assuming stored in Supabase)
  const { data: expertReviews } = await supabase
    .from("expert_reviews")
    .select("slug, updated_at");
  const expertReviewUrls =
    (expertReviews as ExpertReviewDoc[] | null)?.map((review) => ({
      url: `${baseUrl}/reviews/expert/${review.slug}`,
      lastModified: new Date(review.updated_at || new Date()).toISOString(),
      changeFrequency: "monthly",
      priority: 0.75,
    })) || [];

  // 5. Static Pages
  const staticUrls = [
    "/",
    "/about",
    "/careers",
    "/contact",
    "/for-businesses",
    "/for-businesses/plans-pricing",
    "/for-businesses/widgets-integrations",
    "/for-contributors",
    "/affiliates",
    "/help",
    "/blog",
    "/categories",
    "/reviews",
    "/write-a-review",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1.0 : 0.6,
  }));

  // 6. Combine and return
  return [
    ...staticUrls,
    ...sanityUrls,
    ...categoryUrls,
    ...businessUrls,
    ...expertReviewUrls,
  ];
}
