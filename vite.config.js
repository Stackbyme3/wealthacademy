import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: '/' for a custom domain or user-site; '/<repo>/' for a GitHub Pages project site.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  build: { outDir: 'dist' },
});
