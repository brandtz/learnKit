import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

const CONTENT_PACKAGE = process.env.VITE_CONTENT_PACKAGE || 'board-ready'
const contentBase = path.resolve(__dirname, '..', 'content')

/**
 * Recursively copy a directory.
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),

    // DEV: serve /content/ from the monorepo content directory
    {
      name: 'serve-content',
      configureServer(server) {
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
    },

    // BUILD: copy the active content package into dist/content/ after build
    {
      name: 'copy-content',
      closeBundle() {
        const src = path.join(contentBase, CONTENT_PACKAGE)
        const dest = path.resolve(__dirname, 'dist', 'content', CONTENT_PACKAGE)
        if (fs.existsSync(src)) {
          console.log(`\n📦 Copying content/${CONTENT_PACKAGE} → dist/content/${CONTENT_PACKAGE}`)
          copyDirSync(src, dest)
          console.log('✅ Content package copied successfully')
        } else {
          console.warn(`⚠️  Content package not found: ${src}`)
        }
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
