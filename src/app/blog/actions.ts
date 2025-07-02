// src/app/blog/actions.ts
'use server'

import { client } from '@/lib/sanity/client';

const PAGE_SIZE = 6; // Show 6 blog posts per page

export async function fetchMorePosts(page: number) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  // The GROQ query uses array slicing for pagination
  const query = `*[_type == "post"] | order(_createdAt desc) [$from...$to] {
    _id,
    title,
    slug,
    mainImage,
    "categories": categories[]->{title},
    "description": pt::text(body[0...1])
  }`;

  const posts = await client.fetch(query, { from, to });
  return posts;
}