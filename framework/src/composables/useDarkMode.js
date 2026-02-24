import { ref, computed } from 'vue'

const STORAGE_KEY = 'learnkit_darkmode'

const isDark = ref(false)

export function useDarkMode() {
  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      isDark.value = stored === 'true'
    } else {
      // Default to light mode for new users
      isDark.value = false
    }
    applyClass()
  }

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, String(isDark.value))
    applyClass()
  }

  function applyClass() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { isDark, toggle, init }
}
