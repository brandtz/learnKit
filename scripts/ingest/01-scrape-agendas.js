#!/usr/bin/env node

/**
 * Step 1: Scrape Agendas
 * Fetches HTML from the district board page and extracts all PDF links
 * for agendas and minutes from the last 24 months.
 * 
 * Output: content/{package}/agenda/index.json
 */

const cheerio = require('cheerio')
const fs = require('fs/promises')
const path = require('path')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2))
const packageId = args.package || 'board-ready'

async function loadConfig() {
  const configPath = path.join(__dirname, '..', '..', 'content', packageId, 'config.json')
  const raw = await fs.readFile(configPath, 'utf8')
  return JSON.parse(raw)
}

function inferMeetingType(text) {
  const lower = text.toLowerCase()
  if (lower.includes('work session') || lower.includes('worksession')) return 'Work Session'
  if (lower.includes('special')) return 'Special'
  return 'Regular'
}

function extractDate(text) {
  // Try common date patterns
  const patterns = [
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\w+ \d{1,2},? \d{4})/
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const d = new Date(match[1])
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0]
      }
    }
  }
  return null
}

async function main() {
  console.log('  📡 Loading config...')
  const config = await loadConfig()
  const sourceUrl = config.agendaSourceUrl

  if (!sourceUrl) {
    console.log('  ⚠️  No agendaSourceUrl in config — skipping scrape')
    return
  }

  console.log(`  📡 Fetching ${sourceUrl}...`)
  
  // Dynamic import for node-fetch (ESM module)
  const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args))
  
  let html
  try {
    const resp = await fetch(sourceUrl)
    html = await resp.text()
  } catch (err) {
    console.log(`  ⚠️  Could not fetch ${sourceUrl}: ${err.message}`)
    console.log('  ℹ️  Using existing index.json if available')
    return
  }

  const $ = cheerio.load(html)
  const pdfLinks = []
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 24)

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    const text = $(el).text().trim()
    
    if (href && (href.endsWith('.pdf') || href.includes('.pdf'))) {
      const fullUrl = href.startsWith('http') ? href : new URL(href, sourceUrl).href
      const date = extractDate(text) || extractDate(href)
      const meetingType = inferMeetingType(text + ' ' + href)
      
      if (date) {
        const dateObj = new Date(date)
        if (dateObj >= cutoff) {
          pdfLinks.push({
            date,
            meetingType,
            pdfUrl: fullUrl,
            filename: `${date}_${meetingType.replace(/\s+/g, '')}.pdf`,
            linkText: text,
            downloaded: false,
            processed: false
          })
        }
      }
    }
  })

  // Deduplicate by date + meetingType
  const seen = new Set()
  const unique = pdfLinks.filter(item => {
    const key = `${item.date}_${item.meetingType}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Sort by date descending
  unique.sort((a, b) => b.date.localeCompare(a.date))

  const outputDir = path.join(__dirname, '..', '..', 'content', packageId, 'agenda')
  await fs.mkdir(outputDir, { recursive: true })
  
  const outputPath = path.join(outputDir, 'index.json')
  await fs.writeFile(outputPath, JSON.stringify(unique, null, 2))
  
  console.log(`  📋 Found ${unique.length} agenda PDFs (last 24 months)`)
  console.log(`  💾 Saved to ${outputPath}`)
}

main().catch(err => {
  console.error(`  ❌ Scrape failed: ${err.message}`)
  process.exit(1)
})
