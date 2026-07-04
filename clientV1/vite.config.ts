import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import dyadComponentTagger from '@dyad-sh/react-vite-component-tagger';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/v1/',
  plugins: [react(), tailwindcss(), dyadComponentTagger()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
