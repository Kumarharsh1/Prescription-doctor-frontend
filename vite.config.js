import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the backend runs on http://localhost:8000 and we proxy
// /api to it. In production (Render static site) the browser calls the
// deployed backend URL supplied via VITE_API_URL.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
