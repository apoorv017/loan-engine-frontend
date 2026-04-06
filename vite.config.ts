import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/evaluate': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
