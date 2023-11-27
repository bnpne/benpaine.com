import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"
import { deskStructure } from "./structures/deskStructure"

export const config = defineConfig({
  name: "studio",
  projectId: "v5fhyeiw",
  dataset: "production",
  basePath: "/admin",
  plugins: [
    deskTool({
      structure: deskStructure,
    }),
    ,
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
