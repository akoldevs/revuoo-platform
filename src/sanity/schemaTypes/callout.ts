import { defineType } from "sanity";

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Note", value: "note" },
          { title: "Warning", value: "warning" },
          { title: "Tip", value: "tip" },
        ],
        layout: "radio",
      },
    },
    {
      name: "body",
      title: "Body",
      type: "text",
    },
  ],
});
