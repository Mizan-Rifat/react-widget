import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: '',
    cssCodeSplit: true,
    rollupOptions: {
      input: './src/test/test.ts',
      output: {
        // format: 'iife',
        entryFileNames: '[name].js',
        assetFileNames: '[name].css',
      },
    },
  },
});
