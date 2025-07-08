"use client";

import { Button } from "@/components/ui/button";
import { Code2, Puzzle, Download } from "lucide-react";
import Image from "next/image";

// Placeholder logos (replace with actual SVGs in /public/logos)
const partnerLogos = [
  { name: "Shopify", logo: "/logos/shopify.svg", href: "#" },
  { name: "Salesforce", logo: "/logos/salesforce.svg", href: "#" },
  { name: "HubSpot", logo: "/logos/hubspot.svg", href: "#" },
  { name: "Zendesk", logo: "/logos/zendesk.svg", href: "#" },
  { name: "Zapier", logo: "/logos/zapier.svg", href: "#" },
  { name: "Mailchimp", logo: "/logos/mailchimp.svg", href: "#" },
];

export default function IntegrationsAndApi() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Power Your Operations with Revuoo
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Seamlessly connect Revuoo with the business tools you already use
            and love.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-12">
          {/* API Section */}
          <div className="rounded-lg bg-gray-50 p-8">
            <div className="flex items-center gap-4">
              <Code2 className="h-8 w-8 text-indigo-600" />
              <h3 className="text-2xl font-semibold text-gray-900">
                Revuoo API
              </h3>
            </div>
            <p className="mt-4 text-gray-600">
              Access your Revuoo data programmatically to build custom solutions
              and automate your workflows. Perfect for large-scale operations
              and unique use cases.
            </p>
            <ul className="mt-6 space-y-2 text-gray-600 list-disc list-inside">
              <li>Integrate reviews directly into your CRM.</li>
              <li>Display verified reviews on your product pages.</li>
              <li>Automate internal performance reporting.</li>
            </ul>
            <pre className="mt-6 bg-gray-900 text-white text-sm rounded-md p-4 overflow-x-auto">
              <code>
                curl https://api.revuoo.com/v1/reviews{"\n"}
                -H &quot;Authorization: Bearer YOUR_API_KEY&quot;
              </code>
            </pre>
            <Button variant="outline" className="mt-8" asChild>
              <a href="/docs/api" aria-label="Explore API documentation">
                Explore API Documentation
              </a>
            </Button>
          </div>

          {/* Integrations Section */}
          <div className="rounded-lg bg-gray-50 p-8">
            <div className="flex items-center gap-4">
              <Puzzle className="h-8 w-8 text-indigo-600" />
              <h3 className="text-2xl font-semibold text-gray-900">
                Ready-Made Integrations
              </h3>
            </div>
            <p className="mt-4 text-gray-600">
              Connect Revuoo to popular platforms in just a few clicks. Save
              time and centralize your customer feedback data.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {partnerLogos.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 bg-white border rounded-md hover:shadow transition"
                  aria-label={`${partner.name} integration`}
                >
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={80}
                    height={32}
                    className="object-contain h-8 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Assets Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Use Our Brand Assets
          </h3>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Download official Revuoo logos and badges to use in your marketing
            materials.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Includes logos, badges, and usage guidelines.
          </p>
          <div className="mt-8">
            <Button asChild>
              <a
                href="/brand-kit.zip"
                download
                aria-label="Download Revuoo brand kit"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Brand Kit
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
