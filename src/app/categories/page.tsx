// src/app/categories/page.tsx

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Wrench,
  Truck,
  HeartPulse,
  Car,
  Sparkles,
  Users,
  Trees,
  Nut,
  ClipboardCheck,
  Megaphone,
  Calculator,
  HelpCircle,
} from "lucide-react";
import { ComponentType } from "react";

// --- TypeScript Interfaces ---
interface ChildCategory {
  id: string;
  name: string;
  slug: string;
  icon_svg: string | null;
  business_count: number;
}

interface ParentCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  children: ChildCategory[] | null;
}

// --- Icon Mapping ---
const iconMap: { [key: string]: ComponentType<{ className: string }> } = {
  Sparkles,
  Truck,
  Wrench,
  Trees,
  Nut,
  Users,
  ClipboardCheck,
  Megaphone,
  Calculator,
  Car,
  HeartPulse,
};

// --- Sub-Components ---
const CategoryCard = ({ category }: { category: ChildCategory }) => {
  const IconComponent = category.icon_svg
    ? iconMap[category.icon_svg] || HelpCircle
    : HelpCircle;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex items-center gap-4 rounded-lg p-4 bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all"
    >
      <div className="flex-shrink-0 bg-white p-3 rounded-md shadow-sm">
        <IconComponent className="h-6 w-6 text-indigo-600" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900">{category.name}</h3>
        <p className="text-sm text-gray-500">
          {category.business_count} businesses
        </p>
      </div>
    </Link>
  );
};

// --- Main Page Component ---
export const dynamic = "force-dynamic";

export default async function AllCategoriesPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase.rpc(
    "get_all_categories_hierarchical"
  );

  if (error) {
    console.error("Error fetching categories:", error);
  }

  const typedCategories: ParentCategory[] = categories || [];

  return (
    <main>
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Explore All Categories
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find trusted businesses and services across every category on
            Revuoo.
          </p>
        </div>
      </div>

      {/* Category List */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="space-y-16">
            {typedCategories.length > 0 ? (
              typedCategories.map((parent) => (
                <div key={parent.id}>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {parent.name}
                  </h2>
                  {parent.description && (
                    <p className="mt-4 max-w-3xl text-lg text-gray-600">
                      {parent.description}
                    </p>
                  )}
                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {parent.children?.map((child) => (
                      <CategoryCard key={child.id} category={child} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No categories found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
