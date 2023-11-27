import { defineField, defineType } from "sanity"

export const studyItems = defineType({
  title: "Study Items",
  name: "studyItems",
  type: "document",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true, metadata: ["palette", "blurhash"] },
    }),
  ],
})
