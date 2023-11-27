import { defineField, defineType } from "sanity"

export const homePage = defineType({
  name: "homePage",
  type: "document",
  fields: [
    defineField({
      name: "heroText",
      type: "text",
    }),
    defineField({
      name: "footerText",
      type: "text",
    }),
    defineField({
      name: "caseStudies",
      type: "homeCaseStudies",
    }),
  ],
})
