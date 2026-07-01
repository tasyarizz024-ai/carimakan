import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'https://carimakan-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://carimakan-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    host: true,
    allowedHosts: 'all'
  }
})