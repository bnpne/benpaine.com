import { defineField, defineType } from "sanity"

export const homePageImages = defineType({
  name: "homePageImages",
  type: "array",
  title: "Home Page Images",
  description: "Images to be displayed on the Home Page.",
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
})
