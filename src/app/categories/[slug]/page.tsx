// src/app/categories/[slug]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BusinessCard from "@/components/business/BusinessCard";

// Define the types for our data
interface Business {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    revuoo_score: number | null;
}
interface CategoryData {
    id: string;
    name: string;
    description: string | null;
    businesses: Business[] | null;
}

export const dynamic = 'force-dynamic';

export default async function SubCategoryPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    
    // Call our new SQL function with the slug from the URL
    const { data, error } = await supabase
        .rpc('get_category_with_businesses', { category_slug: params.slug });

    if (error || !data) {
        console.error("Error fetching category data:", error);
        notFound();
    }

    const categoryData: CategoryData = data;

    return (
        <main>
            {/* Page Header */}
            <div className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        {categoryData.name}
                    </h1>
                    {categoryData.description && (
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                            {categoryData.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Businesses List */}
            <div className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        Businesses in this category
                    </h2>
                    
                    <div className="mt-10 space-y-6">
                        {categoryData.businesses && categoryData.businesses.length > 0 ? (
                            categoryData.businesses.map((business) => (
                                <BusinessCard key={business.id} business={business} />
                            ))
                        ) : (
                            <p className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg">
                                No businesses have been listed in this category yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}