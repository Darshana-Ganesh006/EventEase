import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  // Use '/' only in local development server (vite dev); use '/EventEase/' for build and preview
  base: process.env.VITE_BASE_PATH || (command === 'serve' && mode === 'development' ? '/' : '/EventEase/'),
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
}))
