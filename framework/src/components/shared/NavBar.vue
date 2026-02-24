<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 h-16 px-4 flex items-center justify-between no-print">
    <!-- Left: hamburger + logo -->
    <div class="flex items-center gap-3">
      <button
        class="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
        aria-label="Toggle navigation menu"
        @click="$emit('toggle-sidebar')"
      >
        <Menu class="w-5 h-5" />
      </button>

      <router-link to="/" class="flex items-center gap-2">
        <BookOpen class="w-6 h-6 text-emerald-400" />
        <span class="text-white font-bold text-lg">{{ siteName }}</span>
      </router-link>

      <span class="hidden sm:inline text-slate-400 text-sm ml-2">{{ siteTagline }}</span>
    </div>

    <!-- Right: progress + user menu + dark mode toggle -->
    <div class="flex items-center gap-3">
      <span v-if="progress.total > 0" class="hidden sm:inline text-sm text-slate-300">
        {{ progress.completed }}/{{ progress.total }} complete
      </span>
      <DarkModeToggle />

      <!-- User menu -->
      <div v-if="isAuthenticated" class="relative">
        <button
          class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          @click="userMenuOpen = !userMenuOpen"
        >
          <UserCircle class="w-5 h-5" />
          <span class="hidden sm:inline">{{ displayName }}</span>
          <ChevronDown class="w-3.5 h-3.5" />
        </button>

        <!-- Dropdown -->
        <div
          v-if="userMenuOpen"
          class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-50"
        >
          <div class="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ displayName }}</p>
            <p v-if="user?.email" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
          </div>
          <button
            class="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>

    <!-- Click-away overlay for user menu -->
    <div v-if="userMenuOpen" class="fixed inset-0 z-40" @click="userMenuOpen = false" />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, BookOpen, UserCircle, ChevronDown, LogOut } from 'lucide-vue-next'
import DarkModeToggle from './DarkModeToggle.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, isAuthenticated, displayName, logout } = useAuth()
const userMenuOpen = ref(false)

function handleLogout() {
  userMenuOpen.value = false
  logout()
  router.push('/login')
}

defineProps({
  siteName: { type: String, default: 'LearnKit' },
  siteTagline: { type: String, default: '' },
  progress: { type: Object, default: () => ({ completed: 0, total: 0, percent: 0 }) }
})

defineEmits(['toggle-sidebar'])
</script>
