import { defineType } from "sanity"

export const homeCaseStudies = defineType({
  name: "homeCaseStudies",
  type: "array",
  of: [
    {
      type: "reference",
      to: [
        {
          type: "caseStudy",
        },
      ],
    },
  ],
})
