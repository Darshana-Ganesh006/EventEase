import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use /EventEase/ (or VITE_BASE_PATH) for production build and local preview
  base: command === 'serve' ? '/' : (process.env.VITE_BASE_PATH || '/EventEase/'),
}))
