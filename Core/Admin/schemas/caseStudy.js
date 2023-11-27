import { defineArrayMember, defineField, defineType } from "sanity"

export const caseStudy = defineType({
  name: "caseStudy",
  type: "document",
  title: "Case Study",
  groups: [
    {
      name: "meta",
      title: "Metadata",
    },
    {
      name: "homePageImagesGroup",
      title: "Home Page Images",
    },
  ],
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", group: "meta" }),
    defineField({ name: "projectDescription", type: "text" }),
    defineField({ name: "projectType", type: "string" }),
    defineField({ name: "sector", type: "string" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "heroImage", type: "image", group: "meta" }),
    defineField({
      name: "backgroundColor",
      description:
        "A color in RGB format i.e. `rbg(255, 0, 0)`. If you would like to convert a HEX number to RGB format, go here https://www.rapidtables.com/convert/color/hex-to-rgb.html",
      type: "string",
      group: "meta",
    }),
    defineField({ name: "overview", type: "textSection" }),
    defineField({ name: "challenge", type: "textSection" }),
    defineField({ name: "approach", type: "textSection" }),
    defineField({
      name: "imageSections",
      type: "array",
      title: "Image Sections",
      of: [
        defineArrayMember({
          name: "caseImageSection",
          type: "caseImageSection",
        }),
      ],
    }),
    defineField({
      name: "homePageImages",
      type: "homePageImages",
      title: "Home Page Images",
      group: "homePageImagesGroup",
    }),
  ],
})
