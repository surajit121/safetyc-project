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
    minify: true, // Will use esbuild by default, fallback to terser if available
    esbuild: {
      drop: ['console', 'debugger']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['antd', '@ant-design/icons'],
          'toast-vendor': ['react-toastify']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1600,
    reportCompressedSize: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  }
})
