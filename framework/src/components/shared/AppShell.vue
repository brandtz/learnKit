<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900">
    <NavBar
      :site-name="config?.siteName || 'LearnKit'"
      :site-tagline="config?.siteTagline || ''"
      :progress="overallProgress"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    />

    <SideBar
      :open="sidebarOpen"
      :features="config?.features || {}"
      @close="sidebarOpen = false"
    />

    <main class="flex-1 pt-16 lg:ml-64">
      <div class="p-4 sm:p-6 lg:p-8">
        <router-view />
      </div>
    </main>

    <footer class="lg:ml-64 py-4 px-6 text-xs text-gray-400 dark:text-gray-600 text-center no-print">
      {{ config?.footerText || 'Built with LearnKit' }}
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from './NavBar.vue'
import SideBar from './SideBar.vue'
import { useContent } from '@/composables/useContent'
import { useProgressStore } from '@/stores/progressStore'

const { loadConfig, loadModules } = useContent()
const progressStore = useProgressStore()

const config = ref(null)
const sidebarOpen = ref(false)
const overallProgress = ref({ completed: 0, total: 0, percent: 0 })

onMounted(async () => {
  config.value = await loadConfig()
  const modules = await loadModules()
  overallProgress.value = progressStore.getOverallProgress(modules.length)
})
</script>
