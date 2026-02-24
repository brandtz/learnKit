import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const PACKAGE_ID = import.meta.env.VITE_CONTENT_PACKAGE || 'board-ready'
const STORAGE_KEY = `learnkit_progress_${PACKAGE_ID}`

export const useProgressStore = defineStore('progress', () => {
  const statuses = ref(loadFromStorage())

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses.value))
  }

  function getStatus(moduleId) {
    return statuses.value[moduleId] || 'not_started'
  }

  function setStatus(moduleId, status) {
    statuses.value[moduleId] = status
    persist()
  }

  function getOverallProgress(totalModules) {
    const completed = Object.values(statuses.value).filter(s => s === 'complete').length
    return {
      completed,
      total: totalModules,
      percent: totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0
    }
  }

  function resetAll() {
    statuses.value = {}
    persist()
  }

  return { statuses, getStatus, setStatus, getOverallProgress, resetAll }
})
