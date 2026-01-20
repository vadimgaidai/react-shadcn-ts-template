import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import autoprefixer from "autoprefixer"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "~", replacement: path.resolve(__dirname, "public") },
    ],
  },
  optimizeDeps: {
    include: [
      "lucide-react",
      "react",
      "react-dom",
      "react-i18next",
      "i18next",
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react-router")) {
            return "vendor-router"
          }

          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query"
          }

          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/zod")
          ) {
            return "vendor-form"
          }

          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/class-variance-authority") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge")
          ) {
            return "vendor-ui"
          }

          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons"
          }

          if (id.includes("node_modules/recharts")) {
            return "vendor-charts"
          }
        },
      },
    },
  },
})
