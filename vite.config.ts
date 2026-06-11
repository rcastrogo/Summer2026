import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Configuración exclusiva para compilar la librería reactiva.
 * Genera src/js/vanilla-reactive.{es,iife}.js
 */
export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'playground/js'),
    emptyOutDir: false,
    minify: 'esbuild',
    sourcemap: true,

    lib: {
      entry: resolve(__dirname, 'src/core/index.ts'),
      name: 'VanillaReactive',
      formats: ['es', 'iife'],
      fileName: (format) => `vanilla-reactive.${format}.js`,
    },

    rollupOptions: {
      output: {
        globals: {},
      },
    },
  },

  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
    },
  },
});