import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    coverage: {
      enabled: true,
      reporter: ['text', 'html'],
      exclude: ['src/main.jsx', 'src/index.css'],
    },
  },
});