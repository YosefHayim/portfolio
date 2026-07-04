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
        manualChunks: {
          // Core React - rarely changes
          "vendor-react": ["react", "react-dom", "react-router", "react-router-dom"],
          // Animation libraries - can be loaded after initial paint
          "vendor-motion": ["framer-motion", "motion"],
          // UI components
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
          ],
          // Utilities
          "vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority", "date-fns"],
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
