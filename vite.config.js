import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // *** 关键修改：设置 base 路径为您的仓库名称，前后都需要斜杠 ***
  plugins: [vue()],
  base: './', // <--- 重点！没这个必白屏
  // *************************************************************
  plugins: [vue()],

  server: {
    host: '0.0.0.0', 
    port: 5173,
  }
})