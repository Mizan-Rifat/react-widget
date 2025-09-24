import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: '',
    minify: 'terser',
    cssCodeSplit: true,
    cssMinify: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        widget: './src/widget/index.tsx',
        'widget-iframe': './src/widget/index-iframe.tsx',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].css',
        manualChunks: undefined, // Disable chunk splitting for widgets
        compact: true,
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      external: [], // Bundle everything for standalone widget
    },

    reportCompressedSize: true,
    chunkSizeWarningLimit: 500, // Warn if chunks exceed 500KB
  },
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  define: {
    // Remove development-only code
    __DEV__: false,
    'process.env.NODE_ENV': '"production"',
  },
});
