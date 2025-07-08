import { defineType } from "sanity";

export const youtube = defineType({
  name: "youtube",
  title: "YouTube Embed",
  type: "object",
  fields: [
    {
      name: "url",
      title: "YouTube URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
          allowRelative: false,
        }),
    },
  ],
});
