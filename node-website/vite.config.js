import { defineConfig } from 'vite';

export default defineConfig({
  mode: 'production',
  publicDir: false,
  build: {
    lib: {
      entry: 'src/client/components/index.jsx', 
      name: 'DragSenseAppClient', 
      fileName: (format) => `app-client.js`, 
      formats: ['umd'], 
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',  // If you want to make React a global variable
        },
        exports: 'default',
        inlineDynamicImports: true, 
      },
      external: ['react'],
    },
    outDir: 'dist', 
    emptyOutDir: false,
    manifest: true,
  },
});