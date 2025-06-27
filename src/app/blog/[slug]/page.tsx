// src/app/blog/[slug]/page.tsx
import { client } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'

// Define a type for our full Post data
interface FullPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  body: any; // The body is a complex array of blocks
}

// This function fetches a single blog post based on its slug
async function getPost(slug: string) {
  // This GROQ query uses a parameter ($slug) to find the one document
  // that matches the type 'post' and has the correct slug.
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body
  }`;

  const post = await client.fetch<FullPost>(query, { slug });
  return post;
}

// This is our page component. It receives params from the URL.
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return (
    <article className="w-full max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">{post.title}</h1>

      {/* The PortableText component renders the rich content from Sanity */}
      <div className="prose max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}