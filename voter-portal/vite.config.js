import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/voter/' : '/'),
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true
  }
})
