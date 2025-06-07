import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to our backend server
      '/api': {
        target: 'http://localhost:3001', // Your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        // secure: false, // Uncomment if your backend is not HTTPS
        // rewrite: (path) => path.replace(/^\/api/, '') // Uncomment if you need to remove /api prefix
      },
      // Proxy /images requests to our backend server
      '/images': {
        target: 'http://localhost:3001', // Your backend server address
        changeOrigin: true,
      }
    },
  },
})
