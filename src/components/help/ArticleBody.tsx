"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

interface ArticleBodyProps {
  body: PortableTextBlock[];
}

export default function ArticleBody({ body }: ArticleBodyProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <PortableText value={body} />
    </div>
  );
}
