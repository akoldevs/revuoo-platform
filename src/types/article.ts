import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImageSource;
  categories: { title: string }[];
  description: string;
  publishedAt?: string;
  author?: {
    name: string;
    image?: SanityImageSource;
  };
}
