import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'serve-content',
      configureServer(server) {
        const contentBase = path.resolve(__dirname, '..', 'content')
        server.middlewares.use('/content', (req, res, next) => {
          const filePath = path.join(contentBase, decodeURIComponent(req.url))
          try {
            const data = fs.readFileSync(filePath)
            if (filePath.endsWith('.json')) {
              res.setHeader('Content-Type', 'application/json')
            } else if (filePath.endsWith('.md')) {
              res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            }
            res.end(data)
          } catch {
            next()
          }
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173
  }
})
