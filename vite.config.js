import { defineConfig } from "vite"
import glsl from "vite-plugin-glsl"
import { resolve } from "path"

export default defineConfig({
  plugins: [glsl()],
  base: "",
  appType: "spa",
  esbuild: {
    jsxInject: `import { toVirtualDom, render } from 'VirtualDom'`,
    jsxFactory: "toVirtualDom",
  },
  resolve: {
    build: {
      rollupOptions: {
        preserveEntrySignatures: true,
        input: {
          main: resolve(__dirname, "index.html"),
        },
      },
    },
    alias: {
      VirtualDom: "./Core/VirtualDom/index.js",
    },
  },
})
