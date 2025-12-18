import { defineConfig } from 'vite';

export default defineConfig({
  base: '/leetcode-141-linked-list-cycle/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    // ⚠️ 严禁修改端口！此端口已固定为 43156
    // ⚠️ DO NOT MODIFY THIS PORT! Fixed at 43156
    port: 43156
  }
});
