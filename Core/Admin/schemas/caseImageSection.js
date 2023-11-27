import { defineField, defineType } from "sanity"

export const caseImageSection = defineType({
  name: "caseImageSection",
  type: "object",
  title: "Image Section",
  fields: [
    defineField({
      name: "images",
      type: "array",
      of: [
        defineField({
          name: "image",
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "sectionDescription",
      type: "text",
    }),
  ],
})
