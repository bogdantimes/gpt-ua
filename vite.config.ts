import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/gpt-ua/',
  plugins: [react()],
  root: "./src/web",
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});