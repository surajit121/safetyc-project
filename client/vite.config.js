import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // during dev, proxy /api to backend
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // Add aliases for common imports to help resolve issues
      'react-toastify': resolve(__dirname, 'node_modules/react-toastify')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // Ensure these packages are properly handled
      external: [],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['antd', '@ant-design/icons'],
          'toast-vendor': ['react-toastify']
        }
      }
    },
    // Increase build limits to prevent warnings
    chunkSizeWarningLimit: 1600
  }
})
