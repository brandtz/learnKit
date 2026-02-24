#!/usr/bin/env node

/**
 * LearnKit Ingestion Pipeline Runner
 * Usage: npm run ingest --package=board-ready
 * Or run individual steps: npm run ingest:scrape, etc.
 */

const { execSync } = require('child_process')
const minimist = require('minimist')
const path = require('path')

const args = minimist(process.argv.slice(2))
const packageId = args.package || 'board-ready'

console.log(`\n🔄 LearnKit Ingestion Pipeline`)
console.log(`📦 Content Package: ${packageId}`)
console.log(`─────────────────────────────\n`)

const steps = [
  { name: 'Scrape Agendas', script: '01-scrape-agendas.js' },
  { name: 'Download PDFs', script: '02-download-pdfs.js' },
  { name: 'Parse PDFs', script: '03-parse-pdfs.js' },
  { name: 'Summarize with AI', script: '04-summarize.js' },
  { name: 'Compile Output', script: '05-compile.js' }
]

async function run() {
  for (const step of steps) {
    console.log(`⏳ Step: ${step.name}...`)
    try {
      const scriptPath = path.join(__dirname, 'ingest', step.script)
      execSync(`node "${scriptPath}" --package=${packageId}`, {
        stdio: 'inherit',
        cwd: __dirname
      })
      console.log(`✅ ${step.name} complete\n`)
    } catch (err) {
      console.error(`❌ ${step.name} failed: ${err.message}`)
      console.error(`   Continuing to next step...\n`)
    }
  }

  console.log(`\n✅ Ingestion pipeline complete for "${packageId}"`)
}

run()
