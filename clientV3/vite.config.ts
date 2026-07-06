import path from 'node:path';
import dyadTagger from '@dyad-sh/react-vite-component-tagger';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

// Raw row example: "app.js" should match the compressed asset extension regex.
const COMPRESSED_ASSET_PATTERN = /\.(js|css|html|svg|json)$/;
// Raw row example: "node_modules/react/index.js" should match the React chunk regex.
const REACT_PACKAGE_PATTERN = /node_modules\/react\//;

const manualChunks = (id: string): string | undefined => {
  if (!id.includes('node_modules')) {
    return;
  }

  if (id.includes('@radix-ui')) {
    return 'vendor-radix';
  }

  if (id.includes('lucide-react') || id.includes('react-icons')) {
    return 'vendor-icons';
  }

  if (id.includes('framer-motion') || id.includes('node_modules/motion')) {
    return 'vendor-motion';
  }

  if (
    id.includes('clsx') ||
    id.includes('tailwind-merge') ||
    id.includes('class-variance-authority') ||
    id.includes('date-fns')
  ) {
    return 'vendor-utils';
  }

  if (
    id.includes('node_modules/react-dom') ||
    id.includes('node_modules/react-router') ||
    REACT_PACKAGE_PATTERN.test(id)
  ) {
    return 'vendor-react';
  }
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dyadTagger(),
    tailwindcss(),
    // Gzip compression for production
    compression({
      algorithms: ['gzip'],
      include: COMPRESSED_ASSET_PATTERN,
      threshold: 1024, // Only compress files > 1KB
    }),
    // Bundle analyzer (only in analyze mode)
    mode === 'analyze' &&
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Enable minification with esbuild (built-in, no extra dependency)
    minify: 'esbuild',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks,
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Generate source maps for production debugging (can disable for smaller build)
    sourcemap: false,
    // Report compressed sizes
    reportCompressedSize: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'framer-motion', 'clsx', 'tailwind-merge'],
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true,
  },
}));
