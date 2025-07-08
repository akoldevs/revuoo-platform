// src/app/careers/page.tsx

import CareersHero from "@/components/careers/CareersHero";
import OpenPositions from "@/components/careers/OpenPositions";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Define the type for our job posting data
export interface Job {
  _id: string;
  title: string;
  slug: { current: string };
  department: string;
  location: string;
  summary: string;
}

// GROQ query to fetch all published job postings
const jobsQuery = groq`*[_type == "jobPosting"] | order(department asc, title asc) {
    _id,
    title,
    slug,
    department,
    location,
    summary
}`;

export default async function CareersPage() {
  // Fetch the jobs data from Sanity
  const jobs: Job[] = await client.fetch(jobsQuery);

  return (
    <main>
      <CareersHero />
      <OpenPositions jobs={jobs} />
    </main>
  );
}
