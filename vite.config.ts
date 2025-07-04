import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    reactRouter(),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    strictPort: true,
    host: 'localhost',
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
    // Using explicit target instead of 'esnext' for broader browser support
    target: ['chrome87', 'edge88', 'firefox78', 'safari14'],
  },
  resolve: {
    alias: {
      '@graphql': '/app/graphql',
      '@app': '/app',
    },
  },
  ssr: {
    noExternal: ['@shopify/hydrogen', '@shopify/remix-oxygen'],
  },
  optimizeDeps: {
    include: ['framer-motion', 'react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  // Improve manifest handling
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
  },
});
