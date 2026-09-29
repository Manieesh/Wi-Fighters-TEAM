import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/rto/' : '/'),
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5175,
    strictPort: true,
  },
})
