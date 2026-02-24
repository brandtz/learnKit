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

    <!-- Right: progress + dark mode toggle -->
    <div class="flex items-center gap-3">
      <span v-if="progress.total > 0" class="hidden sm:inline text-sm text-slate-300">
        {{ progress.completed }}/{{ progress.total }} complete
      </span>
      <DarkModeToggle />
    </div>
  </nav>
</template>

<script setup>
import { Menu, BookOpen } from 'lucide-vue-next'
import DarkModeToggle from './DarkModeToggle.vue'

defineProps({
  siteName: { type: String, default: 'LearnKit' },
  siteTagline: { type: String, default: '' },
  progress: { type: Object, default: () => ({ completed: 0, total: 0, percent: 0 }) }
})

defineEmits(['toggle-sidebar'])
</script>
