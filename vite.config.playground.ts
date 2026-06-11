import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Configuración para el playground de pruebas.
 * Sirve páginas HTML desde playground/ que cargan la librería como IIFE.
 *
 * Flujo: npm run build → npm run dev
 * (primero compilar la lib, luego servir el playground)
 */
export default defineConfig({
  root: '.',
  // Los archivos en src/js/ se sirven en / como estáticos (sin transformar)
  publicDir: 'src/js',

  server: {
    port: 3000,
    open: '/playground/index.html',
  },

  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
    },
  },
});
