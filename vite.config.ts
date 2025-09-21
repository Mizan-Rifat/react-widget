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
      input: {
        widget: './src/widget/index.tsx',
        'widget-iframe': './src/widget/index-iframe.tsx',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].css',
      },
    },
  },
});
