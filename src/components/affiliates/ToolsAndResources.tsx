"use client";

import Image from "next/image";
import { BarChart2, FolderKanban, BookUser, Link2 } from "lucide-react";
import type { FC } from "react";

type Tool = {
  name: string;
  description: string;
  icon: FC<{ className?: string }>;
};

const tools: Tool[] = [
  {
    name: "Affiliate Dashboard",
    description:
      "Real-time tracking of your clicks, signups, conversions, and commissions.",
    icon: BarChart2,
  },
  {
    name: "Marketing Materials",
    description:
      "A full suite of banners, logos, email templates, and social media content to make promotion easy.",
    icon: FolderKanban,
  },
  {
    name: "Training & Support",
    description:
      "Get access to an affiliate manager, onboarding guides, and a dedicated support channel.",
    icon: BookUser,
  },
  {
    name: "Deep Linking",
    description:
      "Link to any page on Revuoo with your referral tag to create highly targeted campaigns.",
    icon: Link2,
  },
];

export default function ToolsAndResources() {
  return (
    <section
      className="bg-gray-900 py-24 sm:py-32"
      aria-labelledby="tools-resources-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          {/* Text Content */}
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className="text-base font-semibold text-indigo-400">
                Tools & Resources
              </p>
              <h2
                id="tools-resources-heading"
                className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Everything You Need to Succeed
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                You’ll get everything you need to succeed—from day one. Our
                professional toolkit and dedicated support are designed to
                maximize your earning potential.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                {tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="relative pl-9 animate-fade-in"
                  >
                    <dt className="inline font-semibold text-white">
                      <tool.icon
                        className="absolute left-1 top-1 h-5 w-5 text-indigo-500"
                        aria-hidden="true"
                      />
                      {tool.name}
                    </dt>
                    <dd className="inline ml-1">{tool.description}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10">
                <a
                  href="#apply"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Join the Affiliate Program
                </a>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          <div className="w-full">
            <Image
              src="/affiliate-dashboard-preview.png"
              alt="Affiliate dashboard preview"
              width={1200}
              height={800}
              className="rounded-xl shadow-xl w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
