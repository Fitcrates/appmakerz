import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'three/addons': path.resolve(__dirname, 'node_modules/three/examples/jsm'),
      'three/examples': path.resolve(__dirname, 'node_modules/three/examples'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide': ['lucide-react']
        }
      }
    }
  },
  server: {
    historyApiFallback: true,
  },
  optimizeDeps: {
    include: ['lucide-react', 'sanity']
  },
  base: '/'
});