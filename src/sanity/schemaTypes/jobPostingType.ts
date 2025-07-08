// src/sanity/schemaTypes/jobPostingType.ts

import { defineType } from "sanity";

export const jobPostingType = defineType({
  name: "jobPosting",
  title: "Job Posting",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          "Engineering",
          "Product",
          "Marketing",
          "Sales",
          "Operations",
          "Trust & Safety",
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "location",
      title: "Location",
      type: "string",
      initialValue: "Remote",
    },
    {
      name: "summary",
      title: "Short Summary",
      type: "text",
      rows: 3,
      description: "A brief, enticing summary for the job listing card.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Full Job Description",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "title",
      department: "department",
    },
    prepare({ title, department }) {
      return {
        title: title,
        subtitle: department,
      };
    },
  },
});
