import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // Ensure assets load correctly on custom domain
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: false,
    allowedHosts: [".manusvm.computer"],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          icons: ['lucide-react'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    assetsInlineLimit: 0, // Don't inline assets to ensure proper caching
    modulePreload: {
      polyfill: false, // Reduce bundle size by not including polyfill
    },
    cssCodeSplit: false, // Combine CSS into single file to reduce request chains
    // Disable minification in development mode
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: process.env.GENERATE_SOURCEMAP !== 'false', // Respect GENERATE_SOURCEMAP env var
  },
  // Ensure proper cache headers for production
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
}));
