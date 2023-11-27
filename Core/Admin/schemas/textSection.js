import { defineField, defineType } from "sanity"

export const textSection = defineType({
  title: "Text Section",
  name: "textSection",
  type: "object",
  description: "Text with header and body",
  fields: [
    defineField({
      name: "sectionHeading",
      title: "Section Heading",
      type: "string",
      description: "A one-word or short sentence heading for the section",
    }),
    defineField({
      name: "sectionBody",
      title: "Section Body",
      type: "text",
      description: "Multi-line body of text.",
    }),
  ],
})
