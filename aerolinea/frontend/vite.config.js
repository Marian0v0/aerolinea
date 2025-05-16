import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // o el que prefieras
    proxy: {
      '/api': {
        target: 'http://localhost:3012',
        changeOrigin: true,
        secure: false
      }
    }
  }
})