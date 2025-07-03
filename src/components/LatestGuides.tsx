// src/components/LatestGuides.tsx
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { client } from '@/lib/sanity/client'; // <-- IMPORT our new Sanity client
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image';

// This is a helper function to generate image URLs from Sanity data
const builder = imageUrlBuilder(client);
function urlFor(source: unknown) {
  return builder.image(source);
}

// Define the type for our article data from Sanity
interface Article {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: unknown;
  categories: {
    title: string;
  }[];
  description: string;
}

export default async function LatestGuides() {
  const query = `*[_type == "post"] | order(_createdAt desc) [0...3] {
    _id,
    title,
    slug,
    mainImage,
    "categories": categories[]->{title},
    "description": pt::text(body[0...1])
  }`;

  const articles: Article[] = await client.fetch(query);

  if (!articles || articles.length === 0) {
     return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Insights Coming Soon!
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our experts are busy writing. Check back soon for our latest guides and articles.
            </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Smarter Decisions Start Here
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Dive into our latest guides and insights. We publish expert-written articles to help you navigate your choices with confidence.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {articles.map((article) => (
             <Link href={`/blog/${article.slug.current}`} key={article._id} className="block">
              <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                {article.mainImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={urlFor(article.mainImage).width(400).height(300).url()}
                      alt={article.title}
                      className="object-cover rounded-t-lg"
                      fill
                    />
                  </div>
                )}
                <CardHeader>
                    {article.categories && (
                      <Badge variant="secondary" className="w-fit">
                        {article.categories[0]?.title || 'General'}
                      </Badge>
                    )}
                  <CardTitle className="text-xl font-semibold pt-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-700 line-clamp-3">{article.description}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm font-semibold text-indigo-600">
                    Read article <span aria-hidden="true">→</span>
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}