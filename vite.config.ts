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
    include: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "vendor-react"
          }
          if (id.includes("node_modules/react-router")) {
            return "vendor-router"
          }

          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix"
          }

          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query"
          }

          if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) {
            return "vendor-i18n"
          }

          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/zod")
          ) {
            return "vendor-form"
          }

          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons"
          }

          if (
            id.includes("node_modules/class-variance-authority") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge")
          ) {
            return "vendor-ui-utils"
          }

          if (id.includes("node_modules/embla-carousel")) {
            return "vendor-carousel"
          }

          if (id.includes("node_modules/cmdk")) {
            return "vendor-cmdk"
          }

          if (id.includes("node_modules/sonner") || id.includes("node_modules/vaul")) {
            return "vendor-notifications"
          }

          if (id.includes("node_modules/next-themes")) {
            return "vendor-theme"
          }
        },
      },
    },
  },
})
