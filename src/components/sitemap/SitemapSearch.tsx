"use client";

import { useEffect } from "react";

export default function SitemapSearch() {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value.toLowerCase();
    document.querySelectorAll("[data-sitemap-link]").forEach((el) => {
      const text = el.textContent?.toLowerCase() || "";
      (el as HTMLElement).style.display = text.includes(query) ? "" : "none";
    });
  };

  return (
    <div className="mb-20 flex flex-col items-center text-center">
      <label
        htmlFor="sitemap-search"
        className="block text-base font-medium text-gray-700 mb-3"
      >
        Search the sitemap
      </label>
      <input
        type="text"
        id="sitemap-search"
        placeholder="Search for a page..."
        className="w-full max-w-2xl rounded-md border border-gray-300 px-5 py-3 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        onInput={handleInput}
      />
    </div>
  );
}
