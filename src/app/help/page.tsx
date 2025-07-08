// src/app/help/page.tsx

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import HelpHeader from "@/components/help/HelpHeader";
import CategoryGrid from "@/components/help/CategoryGrid";
import FeaturedArticles from "@/components/help/FeaturedArticles";

// Updated Category type
interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  icon?: string;
  articleCount?: number;
}

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  category: {
    title: string;
  };
}

// Updated GROQ query for categories
const categoriesQuery = groq`*[_type == "helpCenterCategory"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  icon,
  "articleCount": count(*[_type == "helpArticle" && references(^._id)])
}`;

const featuredArticlesQuery = groq`*[_type == "helpArticle"] | order(_createdAt desc) [0...4] {
  _id,
  title,
  slug,
  summary,
  "category": category->{title}
}`;

export default async function HelpPage() {
  const [categories, featuredArticles] = await Promise.all([
    client.fetch<Category[]>(categoriesQuery),
    client.fetch<Article[]>(featuredArticlesQuery),
  ]);

  return (
    <main>
      <HelpHeader />
      <CategoryGrid categories={categories} />
      <FeaturedArticles articles={featuredArticles} />
    </main>
  );
}
