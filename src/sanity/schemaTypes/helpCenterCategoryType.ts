import { defineType } from "sanity";
import { IconPicker } from "../components/IconPicker"; // We'll create this next

export const helpCenterCategoryType = defineType({
  name: "helpCenterCategory",
  title: "Help Center Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      description: "A short description of what this category is about.",
      rows: 3,
    },
    {
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Choose an icon to visually represent this category.",
      components: {
        input: IconPicker, // Custom visual icon picker
      },
      validation: (Rule) => Rule.required().error("Please select an icon"),
    },
  ],
  preview: {
    select: {
      title: "title",
      icon: "icon",
    },
    prepare({ title, icon }) {
      return {
        title,
        subtitle: icon ? `Icon: ${icon}` : "No icon selected",
      };
    },
  },
});
