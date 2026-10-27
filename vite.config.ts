import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './', // 相对路径，兼容 GitHub Pages 项目页 / Cloudflare Pages 等子路径托管
  plugins: [react(), tailwindcss()],
})
