import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacidade: resolve(__dirname, 'politica-de-privacidade.html'),
        cookies: resolve(__dirname, 'politica-de-cookies.html'),
        termos: resolve(__dirname, 'termos-de-uso.html')
      }
    }
  }
});
