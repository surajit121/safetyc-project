import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import copyStaticFiles from './vite.copy-static'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'copy-static-files',
      writeBundle() {
        // Copy static files directly to dist
        const publicDir = resolve(__dirname, 'public');
        const distDir = resolve(__dirname, 'dist');
        ['sitemap.xml', 'robots.txt'].forEach(file => {
          try {
            const src = resolve(publicDir, file);
            const dest = resolve(distDir, file);
            require('fs').copyFileSync(src, dest);
            console.log(`Copied ${file} to ${dest}`);
          } catch (err) {
            console.error(`Error copying ${file}:`, err);
          }
        });
      }
    }
  ],
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
    // Copy static files to build output
    copyPublicDir: true,
    
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
