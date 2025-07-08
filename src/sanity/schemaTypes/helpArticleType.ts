// src/sanity/schemaTypes/helpArticleType.ts

import { defineType, defineField } from "sanity";

export const helpArticleType = defineType({
  name: "helpArticle",
  title: "Help Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "helpCenterCategory" }],
      description: "The category this article belongs to.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      description:
        "A short summary of the article for search results and previews.",
      rows: 4,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent", // This references your custom blockContent type
      description: "The main content of the article.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
    },
    prepare(selection) {
      const { category } = selection;
      return {
        ...selection,
        subtitle: category ? `in ${category}` : "",
      };
    },
  },
});
