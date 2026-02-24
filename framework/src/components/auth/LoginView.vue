<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
    <div class="w-full max-w-md">
      <!-- Logo & heading -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
          <BookOpen class="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ siteName }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ siteTagline }}
        </p>
      </div>

      <!-- Login card -->
      <form
        class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sm:p-8 space-y-5"
        @submit.prevent="handleLogin"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Sign in to continue
        </h2>

        <!-- Name field -->
        <div>
          <label for="login-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name <span class="text-red-500">*</span>
          </label>
          <input
            id="login-name"
            v-model="name"
            type="text"
            required
            autocomplete="name"
            placeholder="e.g. Jane Smith"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <!-- Email field -->
        <div>
          <label for="login-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email <span class="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="jane@springfield.k12.or.us"
            class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>

        <!-- Error message -->
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
        >
          Get Started
        </button>

        <p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
          Your progress is saved locally in this browser.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BookOpen } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useContent } from '@/composables/useContent'

const router = useRouter()
const { login } = useAuth()
const { loadConfig } = useContent()

const name = ref('')
const email = ref('')
const error = ref('')
const siteName = ref('Board Ready')
const siteTagline = ref('')

onMounted(async () => {
  try {
    const config = await loadConfig()
    siteName.value = config.siteName || 'LearnKit'
    siteTagline.value = config.siteTagline || ''
  } catch {
    // Use defaults
  }
})

function handleLogin() {
  if (!name.value.trim()) {
    error.value = 'Please enter your name.'
    return
  }
  error.value = ''
  login({ name: name.value, email: email.value })
  router.push('/')
}
</script>
