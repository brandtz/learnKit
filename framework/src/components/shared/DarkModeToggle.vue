<template>
  <button
    class="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Moon v-if="!isDark" class="w-5 h-5" />
    <Sun v-else class="w-5 h-5" />
  </button>
</template>

<script setup>
import { Sun, Moon } from 'lucide-vue-next'
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggle } = useDarkMode()
</script>
