// src/sanity/schemaTypes/legalPageType.ts

import { defineType } from 'sanity'

export const legalPageType = defineType({
  name: 'legalPage',
  title: 'Legal & Guideline Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the page (e.g., "Contributor Guidelines", "Privacy Policy")',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      description: 'The date these guidelines were last updated.',
    },
    {
      name: 'body',
      title: 'Body Content',
      type: 'blockContent', // This uses your existing rich text editor
      description: 'The main content of the page.',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
  ],
})