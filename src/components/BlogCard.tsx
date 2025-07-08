"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

function getReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImageSource;
  categories?: { title: string }[];
  description: string;
  publishedAt?: string;
  featured?: boolean;
  author?: {
    name: string;
    image?: SanityImageSource;
  };
}

export default function BlogCard({ article }: { article: Article }) {
  const imageUrl =
    article.mainImage &&
    typeof article.mainImage === "object" &&
    urlFor(article.mainImage).width(500).height(400).url();

  const formattedDate = article.publishedAt
    ? format(new Date(article.publishedAt), "MMMM d, yyyy")
    : null;

  const readingTime = getReadingTime(article.description);

  const authorImageUrl =
    article.author?.image &&
    typeof article.author.image === "object" &&
    urlFor(article.author.image).width(40).height(40).url();

  const fallbackAvatar = "/default-avatar.png"; // ✅ Add this image to your public/ folder

  return (
    <Link
      href={`/blog/${article.slug.current}`}
      className="block h-full group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
    >
      <Card className="relative flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        {article.featured && (
          <Badge className="absolute top-3 right-3 z-10 bg-yellow-400 text-black font-semibold">
            Featured
          </Badge>
        )}

        {imageUrl && (
          <div className="relative h-52 w-full">
            <Image
              src={imageUrl}
              alt={article.title}
              className="object-cover rounded-t-lg group-hover:scale-[1.01] transition-transform"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        )}

        <CardHeader>
          {article.categories && (
            <div className="flex flex-wrap gap-2 mb-2">
              {article.categories.slice(0, 2).map((category) => (
                <Badge key={category.title} variant="secondary">
                  {category.title}
                </Badge>
              ))}
            </div>
          )}

          <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
            {article.title}
          </CardTitle>

          {(article.author?.name || formattedDate) && (
            <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
              <Image
                src={authorImageUrl || fallbackAvatar}
                alt={article.author?.name || "Author"}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">
                  {article.author?.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formattedDate} · {readingTime}
                </span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="text-gray-700 line-clamp-3">{article.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
