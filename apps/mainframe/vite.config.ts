import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
        charset: false,
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src',
      // 考虑到开发体验，开发环境下使用源码引用，生产环境下使用打包产物可能会更好？不行就注释掉这段
      "@mirco-lc-platform/utils": process.env.NODE_ENV === 'development'
        ? path.resolve(__dirname, '../../libs/utils/src')
        : '@mirco-lc-platform/utils'
    }
  }
})
