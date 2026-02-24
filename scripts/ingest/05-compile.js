#!/usr/bin/env node

/**
 * Step 5: Compile Output
 * Merges all individual summary JSON files into a single compiled.json.
 * 
 * Input:  content/{package}/agenda/summaries/*.json
 * Output: content/{package}/agenda/compiled.json
 */

const fs = require('fs/promises')
const path = require('path')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2))
const packageId = args.package || 'board-ready'

async function main() {
  const basePath = path.join(__dirname, '..', '..', 'content', packageId, 'agenda')
  const summariesDir = path.join(basePath, 'summaries')
  const outputPath = path.join(basePath, 'compiled.json')

  let files
  try {
    files = await fs.readdir(summariesDir)
    files = files.filter(f => f.endsWith('.json'))
  } catch {
    console.log('  ⚠️  No summaries found — using existing compiled.json if available')
    return
  }

  if (files.length === 0) {
    console.log('  ℹ️  No summary files to compile')
    return
  }

  const summaries = []

  for (const file of files) {
    try {
      const raw = await fs.readFile(path.join(summariesDir, file), 'utf8')
      const data = JSON.parse(raw)
      summaries.push(data)
    } catch (err) {
      console.log(`  ⚠️  Skipping invalid file: ${file} — ${err.message}`)
    }
  }

  // Also merge with existing compiled.json if present (preserves hand-seeded data)
  try {
    const existingRaw = await fs.readFile(outputPath, 'utf8')
    const existing = JSON.parse(existingRaw)
    
    // Add existing entries that aren't in the new summaries
    const newDates = new Set(summaries.map(s => `${s.date}_${s.meetingType}`))
    for (const item of existing) {
      const key = `${item.date}_${item.meetingType}`
      if (!newDates.has(key)) {
        summaries.push(item)
      }
    }
  } catch {}

  // Sort by date descending
  summaries.sort((a, b) => b.date.localeCompare(a.date))

  await fs.writeFile(outputPath, JSON.stringify(summaries, null, 2))
  
  console.log(`  📊 Compiled ${summaries.length} agenda summaries`)
  console.log(`  💾 Saved to ${outputPath}`)
}

main().catch(err => {
  console.error(`  ❌ Compile failed: ${err.message}`)
  process.exit(1)
})
