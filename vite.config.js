import { defineConfig } from 'vite';

export default defineConfig({
  base: '/leetcode-141-linked-list-cycle/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
