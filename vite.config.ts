import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    host: true,
    // Disable caching in development
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  build: {
    // Generate source maps for better debugging
    sourcemap: false, // Disable sourcemaps in production for smaller bundle size
    // Add content hashes to file names to prevent caching issues
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Add cache control headers for production builds
    manifest: true,
  },
  // Add cache control headers for preview server
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Plugin to handle HTML files
  plugins: [
    react(), // Enable React/TypeScript compilation
    // This will automatically handle cache-busting for your assets
  ]
});