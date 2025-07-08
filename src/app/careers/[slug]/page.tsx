import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import ArticleBody from "@/components/help/ArticleBody";
import { Button } from "@/components/ui/button";
import { MapPin, Building } from "lucide-react";
import Link from "next/link";

// Correctly typed job posting data
interface JobPostingData {
  title: string;
  department: string;
  location: string;
  description: PortableTextBlock[];
}

// GROQ query to fetch a single job posting by slug
const jobQuery = groq`*[_type == "jobPosting" && slug.current == $slug][0]{
  title,
  department,
  location,
  description
}`;

export const dynamic = "force-dynamic";

export default async function SingleJobPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params?.slug || typeof params.slug !== "string") {
    notFound();
  }

  const job = await client.fetch<JobPostingData>(jobQuery, {
    slug: params.slug,
  });

  if (!job) {
    notFound();
  }

  return (
    <main className="bg-white">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: "", // Optional: convert PortableText to plain text if needed
            datePosted: new Date().toISOString(),
            employmentType: "FULL_TIME",
            hiringOrganization: {
              "@type": "Organization",
              name: "Revuoo",
              sameAs: "https://revuoo.com",
            },
            jobLocation: {
              "@type": "Place",
              address: {
                addressLocality: job.location,
                addressCountry: "CY",
              },
            },
          }),
        }}
      />

      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8 animate-fade-in">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/careers"
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to all positions
          </Link>
        </div>

        {/* Job Header */}
        <div className="mb-12">
          <div className="flex items-center gap-x-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{job.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {job.title}
          </h1>
        </div>

        {/* Apply Now Button (Top) */}
        <div className="mb-12">
          <Button size="lg" asChild>
            <a
              href="#"
              aria-disabled="true"
              title="Application system coming soon"
            >
              Apply Now
            </a>
          </Button>
        </div>

        {/* Full Job Description */}
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Description
          </h2>
          <ArticleBody body={job.description} />
        </div>

        {/* Apply Now Button (Bottom) */}
        <div className="mt-12 border-t border-gray-200 pt-12">
          <Button size="lg" asChild>
            <a
              href="#"
              aria-disabled="true"
              title="Application system coming soon"
            >
              Apply Now
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
