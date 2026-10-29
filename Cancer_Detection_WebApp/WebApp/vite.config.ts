import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api/predict": {
        target: process.env.VITE_MODEL_API_URL || "https://cancer-detection-1-2uz2.onrender.com/predict",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/predict/, ""),
      },
    },
  },
})
