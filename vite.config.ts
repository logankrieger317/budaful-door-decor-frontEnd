import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: (assetInfo: { name?: string }) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.jpeg') || name.endsWith('.jpg') || name.endsWith('.png')) {
            return 'images/[name].[hash].[ext]'
          }
          return 'assets/[name].[hash].[ext]'
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
} as UserConfig);
