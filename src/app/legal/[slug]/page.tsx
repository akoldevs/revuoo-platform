// src/app/legal/[slug]/page.tsx

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import type { SanityDocument } from "@sanity/client";
import ArticleBody from "@/components/help/ArticleBody"; // We can reuse this!

interface PageData {
    title: string;
    lastUpdated: string | null;
    body: SanityDocument;
}

// Query to fetch a page by its slug
const pageQuery = groq`*[_type == "legalPage" && slug.current == $slug][0]{
    title,
    lastUpdated,
    body
}`;

export const dynamic = 'force-dynamic';

export default async function GuidelinePage({ params }: { params: { slug: string } }) {
    const pageData = await client.fetch<PageData>(pageQuery, { slug: params.slug });

    if (!pageData) {
        notFound();
    }
    
    const lastUpdatedDate = pageData.lastUpdated 
        ? new Date(pageData.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) 
        : null;

    return (
        <main className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <div className="border-b border-gray-200 pb-8 mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        {pageData.title}
                    </h1>
                    {lastUpdatedDate && (
                        <p className="mt-4 text-sm text-gray-500">
                            Last Updated: {lastUpdatedDate}
                        </p>
                    )}
                </div>
                
                {/* We reuse the ArticleBody component to render the content */}
                <ArticleBody body={pageData.body} />
            </div>
        </main>
    );
}