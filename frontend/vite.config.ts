import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@apis': path.resolve(__dirname, './src/apis'),
      '@routers': path.resolve(__dirname, './src/routers'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: 5173, // Ensure the port matches the exposed port in Docker
  },
});
