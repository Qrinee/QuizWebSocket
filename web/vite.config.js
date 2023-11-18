import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://your_websocket_server',
        ws: true
      },
      "/api": {
        target: "your_api_server",
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
