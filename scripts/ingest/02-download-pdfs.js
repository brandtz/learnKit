#!/usr/bin/env node

/**
 * Step 2: Download PDFs
 * Downloads agenda PDFs that haven't been downloaded yet.
 * 
 * Input:  content/{package}/agenda/index.json
 * Output: content/{package}/agenda/pdfs/*.pdf
 */

const fs = require('fs/promises')
const path = require('path')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2))
const packageId = args.package || 'board-ready'

async function main() {
  const basePath = path.join(__dirname, '..', '..', 'content', packageId, 'agenda')
  const indexPath = path.join(basePath, 'index.json')
  const pdfsDir = path.join(basePath, 'pdfs')

  let index
  try {
    const raw = await fs.readFile(indexPath, 'utf8')
    index = JSON.parse(raw)
  } catch {
    console.log('  ⚠️  No index.json found — run scrape step first')
    return
  }

  await fs.mkdir(pdfsDir, { recursive: true })

  const toDownload = index.filter(item => !item.downloaded)
  console.log(`  📥 ${toDownload.length} PDFs to download`)

  const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args))

  let downloaded = 0
  let failed = 0

  for (const item of toDownload) {
    const outputPath = path.join(pdfsDir, item.filename)
    
    // Skip if file already exists
    try {
      await fs.access(outputPath)
      item.downloaded = true
      downloaded++
      continue
    } catch {}

    try {
      console.log(`  ⬇️  ${item.filename}...`)
      const resp = await fetch(item.pdfUrl)
      
      if (!resp.ok) {
        console.log(`  ⚠️  HTTP ${resp.status} for ${item.pdfUrl}`)
        failed++
        continue
      }

      const buffer = await resp.buffer()
      await fs.writeFile(outputPath, buffer)
      item.downloaded = true
      downloaded++
    } catch (err) {
      console.log(`  ⚠️  Failed: ${item.filename} — ${err.message}`)
      failed++
    }
  }

  // Update index
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2))
  
  console.log(`  ✅ Downloaded: ${downloaded} | Failed: ${failed}`)
}

main().catch(err => {
  console.error(`  ❌ Download failed: ${err.message}`)
  process.exit(1)
})
