import { defineField, defineType } from "sanity"

export const socialLinks = defineType({
  name: "socialLinks",
  type: "document",
  fields: [
    defineField({
      name: "socialLink",
      type: "array",
      of: [
        defineField({
          name: "link",
          type: "object",
          fields: [
            defineField({
              name: "linkText",
              type: "string",
            }),
            defineField({
              name: "href",
              type: "url",
            }),
          ],
        }),
      ],
    }),
  ],
})
