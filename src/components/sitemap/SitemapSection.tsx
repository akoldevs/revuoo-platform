// src/components/sitemap/SitemapSection.tsx

import { ReactNode } from "react";

interface SitemapSectionProps {
  title: string;
  children: ReactNode;
}

export default function SitemapSection({
  title,
  children,
}: SitemapSectionProps) {
  const sectionId = title.toLowerCase().replace(/\s+/g, "-"); // e.g. "Popular Categories" → "popular-categories"

  return (
    <section aria-labelledby={sectionId} className="mb-16">
      <h2
        id={sectionId}
        className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
