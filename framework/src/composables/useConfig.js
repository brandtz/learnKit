import { shallowRef } from 'vue'

const configCache = shallowRef(null)
const PACKAGE_ID = import.meta.env.VITE_CONTENT_PACKAGE || 'board-ready'

export function useConfig() {
  async function getConfig() {
    if (configCache.value) return configCache.value
    const resp = await fetch(`/content/${PACKAGE_ID}/config.json`)
    configCache.value = await resp.json()
    return configCache.value
  }

  return { getConfig }
}
