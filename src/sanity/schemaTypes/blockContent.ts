import { defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    {
      type: "block",
    },
    {
      type: "image",
      options: { hotspot: true },
    },
    {
      type: "code",
      options: {
        language: "javascript",
        withFilename: true,
      },
    },
    {
      type: "callout",
    },
    {
      type: "youtube",
    },
  ],
});
