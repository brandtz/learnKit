#!/usr/bin/env node

/**
 * Step 3: Parse PDFs
 * Extracts raw text from downloaded PDF files.
 * 
 * Input:  content/{package}/agenda/pdfs/*.pdf
 * Output: content/{package}/agenda/text/*.txt
 */

const fs = require('fs/promises')
const path = require('path')
const pdfParse = require('pdf-parse')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2))
const packageId = args.package || 'board-ready'

async function main() {
  const basePath = path.join(__dirname, '..', '..', 'content', packageId, 'agenda')
  const indexPath = path.join(basePath, 'index.json')
  const pdfsDir = path.join(basePath, 'pdfs')
  const textDir = path.join(basePath, 'text')

  let index
  try {
    const raw = await fs.readFile(indexPath, 'utf8')
    index = JSON.parse(raw)
  } catch {
    console.log('  ⚠️  No index.json found — run scrape step first')
    return
  }

  await fs.mkdir(textDir, { recursive: true })

  const toParse = index.filter(item => item.downloaded && !item.processed)
  console.log(`  📄 ${toParse.length} PDFs to parse`)

  let parsed = 0
  let failed = 0

  for (const item of toParse) {
    const pdfPath = path.join(pdfsDir, item.filename)
    const txtFilename = item.filename.replace('.pdf', '.txt')
    const txtPath = path.join(textDir, txtFilename)

    try {
      const buffer = await fs.readFile(pdfPath)
      const data = await pdfParse(buffer)
      await fs.writeFile(txtPath, data.text)
      item.processed = true
      parsed++
      console.log(`  ✅ ${txtFilename} (${data.numpages} pages)`)
    } catch (err) {
      console.log(`  ⚠️  Failed to parse ${item.filename}: ${err.message}`)
      failed++
    }
  }

  // Update index
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2))

  console.log(`  ✅ Parsed: ${parsed} | Failed: ${failed}`)
}

main().catch(err => {
  console.error(`  ❌ Parse failed: ${err.message}`)
  process.exit(1)
})
