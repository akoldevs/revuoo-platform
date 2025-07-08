import Head from "next/head";
import type { FC } from "react";

type SEOProps = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  structuredData?: Record<string, unknown>; // Optional JSON-LD
};

const SEO: FC<SEOProps> = ({
  title,
  description,
  url = "https://www.revuoo.com",
  image = "https://www.revuoo.com/og-image.jpg",
  structuredData,
}) => {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon & Theme */}
      <meta name="theme-color" content="#111827" />
      <link rel="icon" href="/favicon.ico" />

      {/* Optional Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Head>
  );
};

export default SEO;
