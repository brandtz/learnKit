# LearnKit

**A content-agnostic, config-driven learning platform built with Vue 3, Vite, and Tailwind CSS.**

LearnKit is a monorepo that ships a reusable single-page application framework plus swappable content packages. One framework, many deployments — each content package produces its own standalone site with zero framework code changes.

---

## Current Deployments

| Package | Site Name | Modules | Status |
|---------|-----------|---------|--------|
| `board-ready` | Board Ready — Springfield SD 19 Onboarding | 16 | Active v1 |

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18 (tested with v22)
- **npm** ≥ 9

### Install & Run

```bash
# 1 — Clone the repo
git clone git@github.com:brandtz/learnKit.git
cd learnKit

# 2 — Install root dependencies (pipeline tools)
npm install

# 3 — Install framework dependencies
cd framework
npm install

# 4 — Start the dev server
npm run dev          # → http://localhost:5173
```

The dev server includes a custom Vite plugin that serves content files from `../content/` at the `/content/` URL path, so the full app works locally without a build step.

### Production Build

```bash
cd framework
npm run build        # outputs to framework/dist/
npm run preview      # preview the production build locally
```

---

## Project Structure

```
learnkit/
├── framework/                  ← Vue 3 + Vite SPA (shared across deployments)
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/         ← AppShell, NavBar, SideBar, DarkModeToggle,
│   │   │   │                     StatusBadge, TagChip, SourceBadge
│   │   │   ├── dashboard/      ← DashboardView, ModuleCard, TierGroup, ProgressBar
│   │   │   ├── module/         ← ModuleView, SourceCard, KnowledgeCheck, ModuleNav
│   │   │   ├── agenda/         ← AgendaTracker, AgendaCard
│   │   │   ├── issues/         ← IssuesPanel, IssueCard
│   │   │   └── glossary/       ← GlossaryView, GlossaryTerm
│   │   ├── composables/        ← useContent, useProgress, useDarkMode, useConfig
│   │   ├── stores/             ← Pinia progress store (localStorage-backed)
│   │   ├── router/             ← Vue Router (history mode, lazy-loaded routes)
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css           ← Tailwind directives + base styles
│   ├── vite.config.js          ← Vite config + content-serving plugin
│   ├── tailwind.config.cjs     ← Tailwind with dark mode + typography plugin
│   ├── postcss.config.cjs
│   └── index.html
│
├── content/                    ← Content packages (one per deployment)
│   └── board-ready/            ← Springfield SD 19 content package
│       ├── config.json         ← Site name, theme, features, tiers
│       ├── modules/
│       │   ├── index.json      ← Ordered list of all module IDs
│       │   ├── T1-M01/         ← module.json + content.md per module
│       │   ├── T1-M02/
│       │   └── ...             ← 16 modules total
│       ├── agenda/
│       │   └── compiled.json   ← 12 seed board meeting summaries
│       ├── issues/
│       │   └── current-issues.json  ← 3 active board issues
│       └── glossary/
│           └── glossary.json   ← 42 governance terms
│
├── scripts/                    ← Ingestion pipeline
│   ├── ingest.js               ← Pipeline runner (all 5 steps)
│   └── ingest/
│       ├── 01-scrape-agendas.js    ← Scrape PDF links from district board page
│       ├── 02-download-pdfs.js     ← Download PDFs (idempotent)
│       ├── 03-parse-pdfs.js        ← Extract text via pdf-parse
│       ├── 04-summarize.js         ← Summarize via Claude API
│       └── 05-compile.js           ← Merge into compiled.json
│
├── netlify/                    ← Per-deployment Netlify configs
│   └── board-ready.toml        ← Build command, env vars, SPA redirects
│
├── docs/                       ← Design documents & specs
│   ├── BOARD_READY_PRD_BRD.md
│   ├── LEARNKIT_DESIGN.md
│   └── LEARNKIT_TECH_STACK.md
│
├── package.json                ← Root: pipeline scripts + dependencies
├── .gitignore
└── README.md
```

---

## Features

| Feature | Description | Config Flag |
|---------|-------------|-------------|
| **Tiered Learning Path** | Modules grouped into progressive tiers with color-coded cards | Always on |
| **Progress Tracking** | Per-module status (not started → in progress → complete) persisted to localStorage | Always on |
| **Knowledge Checks** | True/false & multiple-choice quizzes with explanations at end of each module | `features.knowledgeChecks` |
| **Agenda Tracker** | Searchable archive of board meeting summaries with tag filtering | `features.agendaTracker` |
| **Current Issues Panel** | Priority-badged cards for active board issues with citations | `features.issuesPanel` |
| **Glossary** | A–Z filtered, searchable governance term definitions with deep linking | `features.glossary` |
| **Dark Mode** | System-preference-aware toggle, persisted to localStorage | `features.darkMode` |
| **Responsive Layout** | Mobile hamburger menu + collapsible sidebar; 1/2/3-column grid | Always on |
| **Print View** | Print-friendly styles (hides nav, full-width content) | `features.printView` |

---

## Board Ready Content Package

### Tier 1 — Governance Foundations (5 modules)

| ID | Title |
|----|-------|
| T1-M01 | Role & Responsibilities of a School Board Member |
| T1-M02 | Parliamentary Procedure & Robert's Rules |
| T1-M03 | Board Meeting Structure & Public Conduct |
| T1-M04 | Board Policy — How It Works |
| T1-M05 | Ethics, Conflicts of Interest & Public Accountability |

### Tier 2 — Oregon-Specific Requirements (6 modules)

| ID | Title |
|----|-------|
| T2-M01 | ORS Chapter 332 — Oregon School Board Law |
| T2-M02 | OAR Chapter 581 — Oregon Administrative Rules for Schools |
| T2-M03 | Oregon Department of Education — Structure & Role |
| T2-M04 | Oregon School Boards Association (OSBA) — Purpose & Member Benefits |
| T2-M05 | Public Meeting Law & Oregon Ethics Requirements |
| T2-M06 | Lane Education Service District (Lane ESD) — Role & Springfield Relationship |

### Tier 3 — Springfield-Specific Context (5 modules)

| ID | Title |
|----|-------|
| T3-M01 | Springfield Public Schools — District Overview |
| T3-M02 | The Board of Directors — Current Members & Governance Structure |
| T3-M03 | Current Issue — 2026-27 Budget Deficit ($10.4M Projected) |
| T3-M04 | Current Issue — Board Position 2 Vacancy & Appointment Process |
| T3-M05 | Current Issue — Curriculum, Programs & Community Priorities |

### Seed Data

- **Glossary:** 42 governance terms (ORS, OAR, OSBA, ESD, etc.)
- **Current Issues:** 3 active items (budget deficit, Position 2 vacancy, Lane ESD service plan)
- **Agenda Archive:** 12 board meeting summaries (Sep 2025 – Feb 2026)

---

## Ingestion Pipeline

The pipeline scrapes, downloads, parses, summarizes, and compiles board meeting agendas into structured JSON. It is designed to be run periodically to keep the agenda archive current.

```bash
# Run full pipeline (requires ANTHROPIC_API_KEY env variable)
npm run ingest -- --package=board-ready

# Or run individual steps
npm run ingest:scrape   -- --package=board-ready
npm run ingest:download -- --package=board-ready
npm run ingest:parse    -- --package=board-ready
npm run ingest:summarize -- --package=board-ready
npm run ingest:compile  -- --package=board-ready
```

### Pipeline Steps

| Step | Script | Description |
|------|--------|-------------|
| 1 | `01-scrape-agendas.js` | Scrape PDF links from the district's board page using Cheerio |
| 2 | `02-download-pdfs.js` | Download PDFs to `content/{pkg}/agenda/pdfs/` (skips existing) |
| 3 | `03-parse-pdfs.js` | Extract text from PDFs via `pdf-parse` → `agenda/text/` |
| 4 | `04-summarize.js` | Summarize text with Claude API → `agenda/summaries/` |
| 5 | `05-compile.js` | Merge summaries into `agenda/compiled.json` (preserves hand-seeded entries) |

> **Note:** Steps 1-3 are fully automated. Step 4 requires an `ANTHROPIC_API_KEY` environment variable. Pipeline artifacts (`pdfs/`, `text/`, `summaries/`) are git-ignored.

---

## Adding a New Content Package

LearnKit is designed so that each deployment is just a new content directory — no framework code changes needed.

1. **Create the content directory:**
   ```
   content/{packageId}/
   ├── config.json          ← Site name, theme colors, feature flags, tiers
   ├── modules/
   │   ├── index.json       ← Ordered array of module IDs
   │   └── {moduleId}/
   │       ├── module.json  ← Metadata, sources, takeaways, knowledge checks
   │       └── content.md   ← Full module content in Markdown
   ├── glossary/glossary.json
   ├── issues/current-issues.json
   └── agenda/compiled.json
   ```

2. **Create a Netlify config:**
   ```toml
   # netlify/{packageId}.toml
   [build]
     base = "framework"
     publish = "dist"
     command = "npm run build"

   [build.environment]
     VITE_CONTENT_PACKAGE = "{packageId}"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Connect the repo to a new Netlify site** and point it at the correct TOML config.

4. **Done** — zero framework code changes required.

---

## Tech Stack

### Framework (`framework/`)

| Dependency | Version | Purpose |
|------------|---------|---------|
| Vue 3 | ^3.5 | Reactive UI (Composition API + `<script setup>`) |
| Vite | ^5.4 | Dev server + production bundler |
| Vue Router 4 | ^4.6 | SPA routing with lazy-loaded routes |
| Pinia | ^3.0 | State management (progress tracking) |
| Tailwind CSS 3 | ^3.4 | Utility-first styling with dark mode (`class` strategy) |
| @tailwindcss/typography | ^0.5 | Prose styling for Markdown content |
| marked.js | ^17.0 | Markdown → HTML rendering |
| Lucide Vue Next | ^0.575 | Icon library |

### Pipeline (`scripts/`)

| Dependency | Version | Purpose |
|------------|---------|---------|
| cheerio | ^1.2 | HTML scraping for agenda PDF links |
| node-fetch | ^3.3 | HTTP requests for PDF downloads |
| pdf-parse | ^2.4 | PDF text extraction |
| @anthropic-ai/sdk | ^0.78 | Claude API for meeting summarization |
| minimist | ^1.2 | CLI argument parsing |

### Hosting

- **Netlify** (free tier) — SPA redirects, environment variables per deployment

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_CONTENT_PACKAGE` | Netlify build env | Content package ID (e.g., `board-ready`) |
| `ANTHROPIC_API_KEY` | Local `.env` | Required for pipeline step 4 (summarization) |

---

## License

Non-commercial civic tool — Brandtworks-Enterprises LLC
