// src/app/help/category/[slug]/page.tsx

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Define the types for our fetched data
interface ArticleStub {
    _id: string;
    title: string;
    slug: { current: string };
    summary: string;
}

interface CategoryData {
    title: string;
    description: string;
    articles: ArticleStub[];
}

// This query finds the category by its slug, and then uses a sub-query
// to find all articles that reference that category's ID.
const categoryQuery = groq`*[_type == "helpCenterCategory" && slug.current == $slug][0]{
  title,
  description,
  "articles": *[_type == "helpArticle" && references(^._id)] | order(_createdAt desc) {
    _id,
    title,
    slug,
    summary
  }
}`;

export const dynamic = 'force-dynamic';

export default async function SingleCategoryPage({ params }: { params: { slug: string } }) {
    const data = await client.fetch<CategoryData>(categoryQuery, { slug: params.slug });

    // If no category is found for the slug, show a 404 page
    if (!data) {
        notFound();
    }

    return (
        <main>
            {/* Page Header */}
            <div className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        {data.title}
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                        {data.description}
                    </p>
                </div>
            </div>

            {/* Articles List */}
            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Articles in this category</h2>
                        
                        <div className="mt-12 space-y-6">
                            {data.articles && data.articles.length > 0 ? (
                                data.articles.map((article) => (
                                    <Link 
                                        href={`/help/article/${article.slug.current}`} 
                                        key={article._id} 
                                        className="block p-8 bg-gray-50 rounded-lg border hover:border-indigo-600 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                                                <p className="mt-2 text-base text-gray-600 line-clamp-2">{article.summary}</p>
                                            </div>
                                            <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0 ml-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="mt-8 text-gray-500">No articles found in this category yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}