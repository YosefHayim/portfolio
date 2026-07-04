import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import { visualizer } from "rollup-plugin-visualizer";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/v2/",
  plugins: [
    react(),
    tailwindcss(),
    // Gzip compression for production
    compression({
      include: /\.(js|css|html|svg|json)$/,
      threshold: 1024, // Only compress files > 1KB
    }),
    // Bundle analyzer (only in analyze mode)
    mode === "analyze" &&
      visualizer({
        open: true,
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification with esbuild (built-in, no extra dependency)
    minify: "esbuild",
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("framer-motion") || id.includes("node_modules/motion"))
            return "vendor-motion";
          if (
            id.includes("clsx") ||
            id.includes("tailwind-merge") ||
            id.includes("class-variance-authority") ||
            id.includes("date-fns")
          )
            return "vendor-utils";

          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router") ||
            id.match(/node_modules\/react\//)
          ) {
            return "vendor-react";
          }
        },
        // Optimize chunk file names for caching
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Target modern browsers for smaller bundle
    target: "es2020",
    // Generate source maps for production debugging (can disable for smaller build)
    sourcemap: false,
    // Report compressed sizes
    reportCompressedSize: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "react-router-dom",
      "framer-motion",
      "clsx",
      "tailwind-merge",
    ],
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true,
  },
}));
