// src/app/blog/actions.ts
"use server";

import { client } from "@/lib/sanity/client";

const PAGE_SIZE = 6; // Number of posts per page

export async function fetchMorePosts(page: number) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  const query = `*[_type == "post"] | order(publishedAt desc) [$from...$to] {
    _id,
    title,
    slug,
    mainImage,
    "categories": categories[]->{title},
    "description": pt::text(body[0...1]),
    "publishedAt": publishedAt,
    "author": author->{name, image}
  }`;

  const posts = await client.fetch(query, { from, to });
  return posts;
}
