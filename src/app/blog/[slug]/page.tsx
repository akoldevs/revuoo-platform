// src/app/blog/[slug]/page.tsx
import { client } from '@/lib/sanity/client';
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image';
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation';

// This is a helper function to generate image URLs from Sanity data
const builder = imageUrlBuilder(client);
function urlFor(source: unknown) {
  return builder.image(source);
}

// Define the type for our article data from Sanity
interface Article {
  title: string;
  mainImage: unknown;
  body: unknown[]; // Portable Text content
}

// This function tells Next.js to fetch the data for a specific post
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    body
  }`;

  const post: Article = await client.fetch(query, { slug });
  return post;
}

// This is our main page component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post: Article = await getPost(params.slug);

  // If no post is found for the slug, show the 404 page
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="space-y-8">
          {/* Post Title */}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>

          {/* Post Image */}
          {post.mainImage && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
               <Image
                  src={urlFor(post.mainImage).url()}
                  alt={post.title}
                  className="object-cover"
                  fill
                />
            </div>
          )}

          {/* Post Body */}
          <div className="prose prose-lg max-w-none">
             <PortableText value={post.body} />
          </div>
        </div>
      </div>
    </div>
  );
}