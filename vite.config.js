import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-production-e9d8.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/isp392')
      }
    }
  }
})
