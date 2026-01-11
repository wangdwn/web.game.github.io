
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 关键：必须匹配你的 GitHub 仓库名
  base: '/web.game.github.io/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保生成的文件名不带多余的特殊字符，兼容 GitHub 环境
    rollupOptions: {
      output: {
        sanitizeFileName: (name) => name.replace(/[^a-z0-9.]/gi, '_')
      }
    }
  }
});
