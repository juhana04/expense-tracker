import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // forwards /api calls to the backend, so no CORS or URL setup is needed
    proxy: { '/api': 'http://localhost:5000' },
  },
});
