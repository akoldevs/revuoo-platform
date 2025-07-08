// src/app/sitemap/page.tsx

import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import SitemapHero from "@/components/sitemap/SitemapHero";
import SitemapSection from "@/components/sitemap/SitemapSection";
import { Metadata } from "next";
import SitemapSearch from "@/components/sitemap/SitemapSearch";

// --- TypeScript Interfaces ---
interface ChildCategory {
  id: string;
  name: string;
  slug: string;
}
interface ParentCategory {
  id: string;
  name: string;
  slug: string;
  children: ChildCategory[] | null;
}
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
}

// --- Data Fetching Queries ---
const blogPostsQuery = groq`*[_type == "post"] | order(_createdAt desc) [0...5] { _id, title, slug }`;

export const metadata: Metadata = {
  title: "Sitemap | Revuoo",
  description:
    "Navigate Revuoo with ease. Explore categories, reviews, guides, and business tools from one central hub.",
};

export default async function SitemapPage() {
  const [{ data: businessCategories }, blogPosts] = await Promise.all([
    supabaseAdmin
      .from("categories")
      .select(
        `
      id,
      name,
      slug,
      children:categories(id, name, slug)
    `
      )
      .is("parent_id", null),
    client.fetch<Post[]>(blogPostsQuery),
  ]);

  const typedBusinessCategories: ParentCategory[] = businessCategories || [];

  return (
    <main aria-label="Sitemap">
      <SitemapHero />

      {/* Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SiteNavigationElement",
          name: [
            "All Reviews",
            "Categories",
            "Guides & Insights",
            "For Businesses",
            "About Us",
            "Help Center",
            "Privacy Policy",
          ],
          url: [
            "https://www.revuoo.com/reviews",
            "https://www.revuoo.com/categories",
            "https://www.revuoo.com/blog",
            "https://www.revuoo.com/for-businesses",
            "https://www.revuoo.com/about",
            "https://www.revuoo.com/help",
            "https://www.revuoo.com/privacy",
          ],
        })}
      </script>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <SitemapSearch />

        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-3 md:gap-x-12">
          {/* Column 1 */}
          <SitemapSection title="Discover">
            <ul className="space-y-4">
              <li data-sitemap-link>
                <Link
                  href="/reviews"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  All Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="font-semibold text-gray-900 hover:text-indigo-600"
                  data-sitemap-link
                >
                  All Categories
                </Link>
                <ul className="mt-2 space-y-2 pl-4 border-l">
                  {typedBusinessCategories.map((parent) => (
                    <li key={parent.id}>
                      <p className="font-medium text-gray-700">{parent.name}</p>
                      <ul className="mt-1 space-y-1 pl-4">
                        {parent.children?.map((child) => (
                          <li key={child.id} data-sitemap-link>
                            <Link
                              href={`/categories/${child.slug}`}
                              className="text-gray-600 hover:text-indigo-600 text-sm"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="font-semibold text-gray-900 hover:text-indigo-600"
                  data-sitemap-link
                >
                  Guides & Insights
                </Link>
                <ul className="mt-2 space-y-2 pl-4 border-l">
                  {blogPosts.map((post) => (
                    <li key={post._id} data-sitemap-link>
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className="text-gray-600 hover:text-indigo-600 text-sm"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <div className="mt-8 text-right">
              <a
                href="#top"
                className="text-sm text-indigo-600 hover:underline"
              >
                Back to Top ↑
              </a>
            </div>
          </SitemapSection>

          {/* Column 2 */}
          <SitemapSection title="For Businesses">
            <ul className="space-y-4">
              <li data-sitemap-link>
                <Link
                  href="/for-businesses"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Business Home
                </Link>
              </li>
              <li data-sitemap-link>
                <Link
                  href="/for-businesses/plans-pricing"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Plans & Pricing
                </Link>
              </li>
              <li data-sitemap-link>
                <Link
                  href="/for-businesses/widgets-integrations"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Widgets & Integrations
                </Link>
              </li>
              <li data-sitemap-link>
                <Link
                  href="/affiliates"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Affiliate Program
                </Link>
              </li>
            </ul>
            <div className="mt-8 text-right">
              <a
                href="#top"
                className="text-sm text-indigo-600 hover:underline"
              >
                Back to Top ↑
              </a>
            </div>
          </SitemapSection>

          {/* Column 3 */}
          <div className="space-y-16">
            <SitemapSection title="Company & Support">
              <ul className="space-y-4">
                <li data-sitemap-link>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    About Us
                  </Link>
                </li>
                <li data-sitemap-link>
                  <Link
                    href="/careers"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Careers
                  </Link>
                </li>
                <li data-sitemap-link>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Contact
                  </Link>
                </li>
                <li data-sitemap-link>
                  <Link
                    href="/help"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
              <div className="mt-8 text-right">
                <a
                  href="#top"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Back to Top ↑
                </a>
              </div>
            </SitemapSection>

            <SitemapSection title="Legal & Trust">
              <ul className="space-y-4">
                <li data-sitemap-link>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li data-sitemap-link>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li data-sitemap-link>
                  <Link
                    href="/trust-safety"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Trust & Safety
                  </Link>
                </li>
                <li data-sitemap-link>
                  <Link
                    href="/for-contributors/guidelines"
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Contributor Guidelines
                  </Link>
                </li>
              </ul>
              <div className="mt-8 text-right">
                <a
                  href="#top"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Back to Top ↑
                </a>
              </div>
            </SitemapSection>
          </div>
        </div>
      </div>
    </main>
  );
}
