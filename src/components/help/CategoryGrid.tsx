"use client";

import Link from "next/link";
import {
  Book,
  HelpCircle,
  Settings,
  FileText,
  Users,
  Shield,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  icon?: string;
  articleCount?: number;
}

const iconMap: Record<string, React.ElementType> = {
  book: Book,
  helpcircle: HelpCircle,
  settings: Settings,
  filetext: FileText,
  users: Users,
  shield: Shield,
  briefcase: Briefcase,
};

export default function CategoryGrid({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories || categories.length === 0) return null;

  return (
    <section
      aria-labelledby="help-categories-heading"
      className="bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="help-categories-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Browse by Category
          </h2>
        </div>

        <div
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {categories.map((category, index) => {
            const Icon =
              category.icon && iconMap[category.icon.toLowerCase()]
                ? iconMap[category.icon.toLowerCase()]
                : HelpCircle;

            return (
              <motion.article
                key={category._id}
                role="listitem"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/help/category/${category.slug.current}`}
                  className="block rounded-lg p-8 bg-gray-50 hover:bg-gray-100 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-labelledby={`category-${category._id}-title`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Icon
                        className="h-6 w-6 text-indigo-600"
                        aria-hidden="true"
                      />
                    </div>
                    <h3
                      id={`category-${category._id}-title`}
                      className="text-xl font-semibold text-gray-900"
                    >
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-base text-gray-600">
                    {category.description ||
                      "Explore helpful articles in this category."}
                  </p>
                  {typeof category.articleCount === "number" && (
                    <p className="mt-3 text-sm text-gray-500">
                      {category.articleCount} article
                      {category.articleCount !== 1 && "s"}
                    </p>
                  )}
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
