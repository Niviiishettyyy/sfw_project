import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/sfw_project/',
  plugins: [react()],
  server: {
    port: 5173
  }
});

