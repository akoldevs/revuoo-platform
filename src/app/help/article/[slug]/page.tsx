// src/app/help/article/[slug]/page.tsx

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import ArticleBody from "@/components/help/ArticleBody";

interface Article {
  title: string;
  createdAt: string;
  category: {
    title: string;
  };
  body: PortableTextBlock[]; // ✅ Correct type for Portable Text
}

const articleQuery = groq`*[_type == "helpArticle" && slug.current == $slug][0]{
  title,
  "createdAt": _createdAt,
  "category": category->{title},
  body
}`;

export const dynamic = "force-dynamic";

export default async function SingleArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await client.fetch<Article>(articleQuery, {
    slug: params.slug,
  });

  if (!article) {
    notFound();
  }

  const creationDate = new Date(article.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
        {/* Article Header */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            {article.category.title}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Published on {creationDate}
          </p>
        </div>

        {/* Article Body */}
        <ArticleBody body={article.body} />
      </div>
    </main>
  );
}
