import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      lib: path.resolve(process.cwd(), './lib'),
      src: path.resolve(process.cwd(), './src')
    }
  },

  base: '/connect-four/',

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/main.scss";`
      }
    }
  },

  plugins: [vue()]
})
