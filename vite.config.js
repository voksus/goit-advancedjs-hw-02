import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  define: {
    global: 'window',
  },
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        timer: resolve(__dirname, 'src/1-timer.html'),
        snackbar: resolve(__dirname, 'src/2-snackbar.html'),
      },
    },
  },
});
