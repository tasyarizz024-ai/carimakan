import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'pacific-purpose-production-0218.up.railway.app',
      '.railway.app',
      'localhost'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'pacific-purpose-production-0218.up.railway.app',
      '.railway.app',
      'localhost'
    ]
  }
})