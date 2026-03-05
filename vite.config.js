import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,              // listen on all addresses
    strictPort: true,
    port: 5173,
    allowedHosts: ['.kwiqserve.com'], // allow all subdomains of kwiqserve.com
  },
})