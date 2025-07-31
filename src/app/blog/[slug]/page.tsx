// src/app/blog/[slug]/page.tsx
import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ViewCounter } from "@/components/blog/ViewCounter";

interface FullPost {
  _id: string; // We need the _id
  title: string;
  slug: {
    current: string;
  };
  body: PortableTextBlock[];
}

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id, // Ensure we fetch the _id
    title,
    slug,
    body
  }`;

  const post = await client.fetch<FullPost>(query, { slug });
  return post;
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    // Handle case where post is not found
    return <div>Post not found.</div>;
  }

  return (
    <article className="w-full max-w-3xl mx-auto px-6 py-12">
      {/* ✅ FIX: Pass the document's unique _id to the ViewCounter */}
      <ViewCounter documentId={post._id} />

      <h1 className="text-4xl font-extrabold tracking-tight mb-8">
        {post.title}
      </h1>
      <div className="prose max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
