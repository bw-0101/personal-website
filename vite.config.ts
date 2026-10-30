import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * 两页输出：
 *   index.html → 展示站
 *   admin.html → 后台
 *
 * base: './' → 相对路径，`node server/app.mjs` 直接托管 dist/ 即可。
 */
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    // 本地开发时把 /api 转发到 `npm run server`（4173 端口）
    proxy: {
      '/api': { target: 'http://localhost:4173', changeOrigin: true },
    },
  },
})