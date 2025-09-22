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
    terserOptions: {
      ecma: 2020,
      module: true,
      toplevel: true,
      compress: {
        arguments: true,
        arrows: true,
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        computed_props: true,
        conditionals: true,
        dead_code: true,
        directives: true,
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        evaluate: true,
        expression: true,
        hoist_funs: true,
        hoist_props: true,
        hoist_vars: false,
        if_return: true,
        inline: true,
        join_vars: true,
        keep_fargs: false,
        loops: true,
        module: true,
        negate_iife: true,
        passes: 3, // Multiple passes for better optimization
        properties: true,
        pure_funcs: [
          'console.log',
          'console.info',
          'console.debug',
          'console.warn',
        ],
        pure_getters: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: false,
        switches: true,
        toplevel: true,
        typeofs: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        unused: true,
      },
      mangle: {
        toplevel: true,
        eval: true,
        keep_fnames: false,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
        ecma: 2020,
      },
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
    drop: ['console', 'debugger'],
  },
  define: {
    // Remove development-only code
    __DEV__: false,
    'process.env.NODE_ENV': '"production"',
  },
});
