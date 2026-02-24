#!/usr/bin/env node

/**
 * Step 4: Summarize with AI
 * Uses Claude to generate structured summaries of parsed agenda text.
 * 
 * Input:  content/{package}/agenda/text/*.txt
 * Output: content/{package}/agenda/summaries/*.json
 */

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs/promises')
const path = require('path')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2))
const packageId = args.package || 'board-ready'

const RATE_LIMIT_MS = 2000 // 1 request per 2 seconds

const SYSTEM_PROMPT = `You are a civic document analyst specializing in Oregon public school board governance. You produce structured, factual summaries of school board meeting agendas and minutes.`

const USER_PROMPT_TEMPLATE = `Summarize this Springfield Oregon school board meeting agenda or minutes.
Return ONLY valid JSON with these fields:
{
  "date": "YYYY-MM-DD",
  "meetingType": "Regular" | "Work Session" | "Special",
  "topItems": ["string array, max 5 brief phrases"],
  "tags": ["select from: Budget, Curriculum, Facilities, Personnel, Policy, Special Ed, Governance, Community"],
  "budgetFlag": true/false,
  "keyDecisions": ["string array of any votes or formal actions taken"],
  "summary": "2-3 sentence plain-language summary of the meeting"
}

Document:
`

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const basePath = path.join(__dirname, '..', '..', 'content', packageId, 'agenda')
  const textDir = path.join(basePath, 'text')
  const summariesDir = path.join(basePath, 'summaries')

  await fs.mkdir(summariesDir, { recursive: true })

  let textFiles
  try {
    textFiles = await fs.readdir(textDir)
    textFiles = textFiles.filter(f => f.endsWith('.txt'))
  } catch {
    console.log('  ⚠️  No text files found — run parse step first')
    return
  }

  // Filter out already summarized
  const existing = new Set()
  try {
    const summaryFiles = await fs.readdir(summariesDir)
    summaryFiles.forEach(f => existing.add(f.replace('.json', '')))
  } catch {}

  const toSummarize = textFiles.filter(f => !existing.has(f.replace('.txt', '')))
  console.log(`  🤖 ${toSummarize.length} documents to summarize`)

  if (toSummarize.length === 0) return

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('  ⚠️  ANTHROPIC_API_KEY not set — skipping AI summarization')
    console.log('  ℹ️  Set the key in .env or environment variables')
    return
  }

  const client = new Anthropic()
  let summarized = 0
  let failed = 0

  for (const file of toSummarize) {
    const textPath = path.join(textDir, file)
    const jsonFilename = file.replace('.txt', '.json')
    const jsonPath = path.join(summariesDir, jsonFilename)

    try {
      const text = await fs.readFile(textPath, 'utf8')
      
      // Truncate very long documents to stay within context limits
      const truncated = text.substring(0, 15000)

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: USER_PROMPT_TEMPLATE + truncated }
        ]
      })

      const content = response.content[0].text
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const summary = JSON.parse(jsonMatch[0])
      await fs.writeFile(jsonPath, JSON.stringify(summary, null, 2))
      
      summarized++
      console.log(`  ✅ ${jsonFilename}`)

      // Rate limiting
      await sleep(RATE_LIMIT_MS)
    } catch (err) {
      console.log(`  ⚠️  Failed: ${file} — ${err.message}`)
      failed++
    }
  }

  console.log(`  ✅ Summarized: ${summarized} | Failed: ${failed}`)
}

main().catch(err => {
  console.error(`  ❌ Summarize failed: ${err.message}`)
  process.exit(1)
})
