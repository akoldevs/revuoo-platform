// src/components/BlogCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { client } from '@/lib/sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Helper function to generate image URLs from Sanity data
const builder = imageUrlBuilder(client);
function urlFor(source: unknown) {
  return builder.image(source);
}

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: unknown;
  categories?: { title: string }[];
  description: string;
}

export default function BlogCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug.current}`} className="block h-full">
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        {article.mainImage ? (() => {
          const imageUrl = urlFor(article.mainImage).width(500).height(400).url();
          if (typeof imageUrl === 'string' && imageUrl) {
            return (
              <div className="relative h-52 w-full">
                <Image
                  src={imageUrl}
                  alt={article.title}
                  className="object-cover rounded-t-lg"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            );
          }
          return null;
        })() : null}
        <CardHeader>
          {article.categories && (
            <div className="flex gap-2 mb-2">
              {article.categories.slice(0, 2).map((category: { title: string }) => (
                <Badge key={category.title} variant="secondary">
                  {category.title}
                </Badge>
              ))}
            </div>
          )}
          <CardTitle className="text-xl font-semibold">{article.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-700 line-clamp-3">{article.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}