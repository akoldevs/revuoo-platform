// src/components/CategoryShowcase.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Home,
  Wrench,
  CloudCog,
  Truck,
  HeartPulse,
  Car,
  HelpCircle,
} from "lucide-react";
import { ComponentType } from "react";

// Category type definition
interface Category {
  id: string;
  name: string;
  slug: string;
  icon_svg: string | null;
  business_count: number;
}

// Icon mapping from DB string to Lucide icon
const iconMap: Record<string, ComponentType<{ className: string }>> = {
  Home,
  Wrench,
  CloudCog,
  Truck,
  HeartPulse,
  Car,
};

const CategoryCard = ({ category }: { category: Category }) => {
  const IconComponent =
    category.icon_svg && iconMap[category.icon_svg]
      ? iconMap[category.icon_svg]
      : HelpCircle;

  return (
    <article
      className="flex flex-col p-6 rounded-lg hover:bg-gray-50 transition-colors border"
      aria-labelledby={`category-${category.slug}`}
    >
      <Link
        href={`/categories/${category.slug}`}
        prefetch={false}
        className="flex flex-col flex-1"
      >
        <dt
          id={`category-${category.slug}`}
          className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900"
        >
          <IconComponent
            className="h-6 w-6 flex-none text-indigo-600"
            aria-hidden="true"
          />
          {category.name}
        </dt>
        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
          <p className="flex-auto">
            Explore {category.business_count} businesses and services in this
            category.
          </p>
          <p className="mt-6">
            <span className="text-sm font-semibold leading-6 text-indigo-600">
              View options <span aria-hidden="true">→</span>
            </span>
          </p>
        </dd>
      </Link>
    </article>
  );
};

export default async function CategoryShowcase() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase.rpc("get_top_categories", {
    limit_count: 6,
  });

  if (error) {
    console.error("Error fetching top categories:", error.message || error);
    return (
      <section className="bg-white py-24 sm:py-32 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-semibold text-red-600">
            Failed to load categories
          </h2>
          <p className="mt-4 text-gray-500">
            Please try again later or contact support.
          </p>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Explore Popular Categories
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              As businesses join our platform, our top categories will be
              showcased here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="category-heading"
      className="bg-white py-24 sm:py-32 relative"
    >
      {/* 🔍 SEO Structured Data Injection */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Popular Categories",
          itemListElement: categories.map((cat: Category, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: cat.name,
            url: `https://www.revuoo.com/categories/${cat.slug}`,
          })),
        })}
      </script>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="category-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Explore Popular Categories
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find and compare top-rated businesses and services across a variety
            of categories to meet your specific needs.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {categories.map((category: Category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
