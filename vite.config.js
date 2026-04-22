import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { homedir } from 'node:os'
// import { resolve } from 'node:path'
// import fs from 'fs';

// const homePath = homedir()

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,              // listen on all addresses
    strictPort: true,
    // https: {
    //   key: fs.readFileSync(resolve(homePath, 'excellers.lvh.me-key.pem')),
    //   cert: fs.readFileSync(resolve(homePath, 'excellers.lvh.me.pem')),
    // },
    port: 5173,
    allowedHosts: ['.kwiqserve.com', '.lvh.me'], // allow all subdomains of kwiqserve.com
  },
})
