"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Job } from "@/app/careers/page";

export default function OpenPositions({ jobs }: { jobs: Job[] }) {
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const departmentLabels: Record<string, string> = {
    engineering: "Engineering",
    design: "Design",
    marketing: "Marketing",
    sales: "Sales",
    support: "Customer Support",
  };

  const departments = useMemo(() => {
    const allDepts = jobs.map((job) => job.department);
    return ["All", ...Array.from(new Set(allDepts))];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (selectedDepartment === "All") return jobs;
    return jobs.filter((job) => job.department === selectedDepartment);
  }, [jobs, selectedDepartment]);

  return (
    <section id="open-positions" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Your Role at Revuoo
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            We&apos;re looking for passionate people to join us on our mission.
          </p>
        </div>

        {/* Department Filter */}
        <div
          role="tablist"
          aria-label="Job departments"
          className="mt-16 flex justify-center"
        >
          <div className="flex flex-wrap gap-2 rounded-lg bg-gray-100 p-2">
            {departments.map((dept) => {
              const isSelected = selectedDepartment === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {departmentLabels[dept] ?? dept}
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Listings */}
        <section
          className="mt-12 space-y-8"
          aria-label={`Open positions in ${selectedDepartment}`}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <article
                key={job._id}
                className="p-6 bg-gray-50 rounded-lg border hover:border-indigo-300 transition hover:shadow-md hover:scale-[1.01] transform duration-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900">
                      <Link
                        href={`/careers/${job.slug.current}`}
                        className="hover:text-indigo-600"
                      >
                        {job.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {departmentLabels[job.department] ?? job.department} •{" "}
                      {job.location}
                    </p>
                    <p className="mt-3 text-base text-gray-700">
                      {job.summary}
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-2 sm:mt-0">
                    <Link
                      href={`/careers/${job.slug.current}`}
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              There are currently no open positions in this department. Check
              back soon!
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
