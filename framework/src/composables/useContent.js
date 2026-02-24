import { ref, shallowRef } from 'vue'
import { marked } from 'marked'

const PACKAGE_ID = import.meta.env.VITE_CONTENT_PACKAGE || 'board-ready'

const configCache = shallowRef(null)
const modulesCache = shallowRef(null)

export function useContent() {
  async function loadConfig() {
    if (configCache.value) return configCache.value
    const resp = await fetch(`/content/${PACKAGE_ID}/config.json`)
    configCache.value = await resp.json()
    return configCache.value
  }

  async function loadModules() {
    if (modulesCache.value) return modulesCache.value
    const config = await loadConfig()
    const moduleIds = []

    // Build list of module IDs from tiers
    for (const tier of config.tiers) {
      // Load tier module index
      try {
        const resp = await fetch(`/content/${PACKAGE_ID}/modules/${tier.id}-modules.json`)
        const ids = await resp.json()
        moduleIds.push(...ids)
      } catch {
        // Fallback: try common IDs
      }
    }

    // If we got module IDs from the index, load them
    if (moduleIds.length > 0) {
      const modules = await Promise.all(
        moduleIds.map(async (id) => {
          try {
            const resp = await fetch(`/content/${PACKAGE_ID}/modules/${id}/module.json`)
            return await resp.json()
          } catch {
            return null
          }
        })
      )
      modulesCache.value = modules.filter(Boolean)
    } else {
      // Fallback: load from master index
      try {
        const resp = await fetch(`/content/${PACKAGE_ID}/modules/index.json`)
        const allIds = await resp.json()
        const modules = await Promise.all(
          allIds.map(async (id) => {
            try {
              const r = await fetch(`/content/${PACKAGE_ID}/modules/${id}/module.json`)
              return await r.json()
            } catch {
              return null
            }
          })
        )
        modulesCache.value = modules.filter(Boolean)
      } catch {
        modulesCache.value = []
      }
    }

    return modulesCache.value
  }

  async function loadModule(id) {
    const metaResp = await fetch(`/content/${PACKAGE_ID}/modules/${id}/module.json`)
    const meta = await metaResp.json()

    let contentHtml = ''
    try {
      const mdResp = await fetch(`/content/${PACKAGE_ID}/modules/${id}/content.md`)
      const mdText = await mdResp.text()
      contentHtml = marked(mdText)
    } catch {
      contentHtml = '<p>Content loading...</p>'
    }

    return { meta, contentHtml }
  }

  async function loadAgendas() {
    try {
      const resp = await fetch(`/content/${PACKAGE_ID}/agenda/compiled.json`)
      return await resp.json()
    } catch {
      return []
    }
  }

  async function loadIssues() {
    try {
      const resp = await fetch(`/content/${PACKAGE_ID}/issues/current-issues.json`)
      return await resp.json()
    } catch {
      return []
    }
  }

  async function loadGlossary() {
    try {
      const resp = await fetch(`/content/${PACKAGE_ID}/glossary/glossary.json`)
      return await resp.json()
    } catch {
      return []
    }
  }

  return { loadConfig, loadModules, loadModule, loadAgendas, loadIssues, loadGlossary }
}
