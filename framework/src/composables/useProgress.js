import { ref, computed } from 'vue'

const PACKAGE_ID = import.meta.env.VITE_CONTENT_PACKAGE || 'board-ready'
const STORAGE_KEY = `learnkit_progress_${PACKAGE_ID}`

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const progress = ref(loadProgress())

export function useProgress() {
  function getStatus(moduleId) {
    return progress.value[moduleId] || 'not_started'
  }

  function setStatus(moduleId, status) {
    progress.value[moduleId] = status
    saveProgress(progress.value)
  }

  function getOverallProgress(totalModules) {
    const completed = Object.values(progress.value).filter(s => s === 'complete').length
    const total = totalModules || Object.keys(progress.value).length
    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  function resetAll() {
    progress.value = {}
    saveProgress({})
  }

  return { progress, getStatus, setStatus, getOverallProgress, resetAll }
}
