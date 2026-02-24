import { ref, computed } from 'vue'

const STORAGE_KEY = 'learnkit_auth'

const user = ref(loadFromStorage())

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persist(data) {
  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)
  const displayName = computed(() => user.value?.name || '')

  /**
   * Log in with a name and optional email.
   * This is a simple client-side auth gate — no server validation.
   * Replace this with real auth (OAuth, Firebase, etc.) when needed.
   */
  function login({ name, email = '' }) {
    user.value = {
      name: name.trim(),
      email: email.trim(),
      loggedInAt: new Date().toISOString()
    }
    persist(user.value)
  }

  function logout() {
    user.value = null
    persist(null)
  }

  return { user, isAuthenticated, displayName, login, logout }
}
