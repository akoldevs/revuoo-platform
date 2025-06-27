// src/app/blog/page.tsx
import { client } from '@/lib/sanity';
import Link from 'next/link';

// Define a type for our Post data for TypeScript
interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

// This function fetches all blog posts from Sanity
async function getPosts() {
  // Sanity uses a query language called GROQ. This query is simple:
  // it says "get all documents (*) that are of the type 'post'".
  const query = `*[_type == "post"] {
    _id,
    title,
    slug
  }`;

  const posts = await client.fetch<Post[]>(query);
  return posts;
}

// This is our main page component
export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Guides & Insights</h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post._id} href={`/blog/${post.slug.current}`}>
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h2 className="text-2xl font-bold">{post.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}