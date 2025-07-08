// src/components/help/FeaturedArticles.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  category: {
    title: string;
  };
}

export default function FeaturedArticles({
  articles,
}: {
  articles: Article[];
}) {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-articles-heading"
      className="bg-gray-50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="featured-articles-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Top Articles
          </h2>
        </div>

        <div className="mt-16 space-y-4 max-w-3xl mx-auto" role="list">
          {articles.map((article) => (
            <article key={article._id}>
              <Link
                href={`/help/article/${article.slug.current}`}
                className="block p-6 bg-white rounded-lg border hover:border-indigo-600 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-labelledby={`article-${article._id}-title`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      {article.category?.title || "General"}
                    </p>
                    <h3
                      id={`article-${article._id}-title`}
                      className="mt-1 text-lg font-semibold text-gray-900"
                    >
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {article.summary || "No summary available."}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
