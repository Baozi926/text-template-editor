import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    //打包后文件目录
    outDir: "dist",
    //压缩
    minify: true,
    rollupOptions: {
      //忽略打包vue文件
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        dir: "dist",
      },
    },
    lib: {
      entry: "./src/index.ts",
      name: "text-template-editor",
      fileName: "index",
      formats: ["es", "umd", "cjs"],
    },
  },
  plugins: [vue()],
})
