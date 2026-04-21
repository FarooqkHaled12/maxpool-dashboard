import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/index.js',
        assetFileNames: 'assets/index.[ext]'
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api':     { target: 'https://maxpool-production.up.railway.app', changeOrigin: true },
      '/uploads': { target: 'https://maxpool-production.up.railway.app', changeOrigin: true }
    }
  }
});
