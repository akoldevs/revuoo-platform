// src/components/contributors/IdealCandidate.tsx

"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";

const ListItem = ({ children }: { children: ReactNode }) => (
  <li className="flex gap-x-3 animate-fade-in">
    <Check
      className="mt-1 h-5 w-5 flex-none text-indigo-600"
      aria-hidden="true"
    />
    <span>{children}</span>
  </li>
);

export default function IdealCandidate() {
  return (
    <section
      className="bg-gray-50 py-24 sm:py-32"
      aria-labelledby="ideal-candidate-heading"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          {/* Left Column: Who We're Looking For */}
          <div>
            <h2
              id="ideal-candidate-heading"
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Who We&apos;re Looking For
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We’re building a diverse team of credible, articulate, and
              passionate experts. If this sounds like you, we’d love to connect.
            </p>
            <ul
              role="list"
              className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none"
            >
              <ListItem>
                <span className="font-semibold text-gray-900">
                  Industry Professionals:
                </span>{" "}
                You have hands-on experience in the services or software you
                review (e.g., you’re a plumber, a marketer, a developer).
              </ListItem>
              <ListItem>
                <span className="font-semibold text-gray-900">
                  Passionate Hobbyists:
                </span>{" "}
                You are a power-user or enthusiast with deep knowledge in a
                specific niche (e.g., home automation, specific SaaS tools).
              </ListItem>
              <ListItem>
                <span className="font-semibold text-gray-900">
                  Strong, Unbiased Writers:
                </span>{" "}
                You can communicate complex topics clearly and fairly, focusing
                on objective analysis and helpful insights.
              </ListItem>
            </ul>
          </div>

          {/* Right Column: What You'll Write */}
          <div className="p-10 sm:p-12 bg-white rounded-lg shadow-lg animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What You&apos;ll Write
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-indigo-600">
                  Expert Reviews
                </h4>
                <p className="text-gray-600 mt-1">
                  In-depth, hands-on reviews of specific businesses, products,
                  or software—resulting in a detailed analysis and a final
                  “Expert Score.”
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-indigo-600">
                  Comprehensive Guides
                </h4>
                <p className="text-gray-600 mt-1">
                  Long-form articles that compare multiple options (e.g., “The 5
                  Best CRMs for Small Business”) or explain complex topics to
                  help users make decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
