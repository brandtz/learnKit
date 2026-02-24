<template>
  <div class="max-w-6xl mx-auto">
    <!-- Overall Progress -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Learning Path</h1>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ progress.completed }} of {{ progress.total }} modules complete
        </span>
      </div>
      <ProgressBar :percent="progress.percent" />
    </div>

    <!-- Current Issues Banner (mobile) -->
    <div v-if="issues.length > 0" class="lg:hidden mb-6">
      <button
        class="w-full flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-medium text-amber-800 dark:text-amber-400"
        @click="issuesBannerOpen = !issuesBannerOpen"
      >
        <span class="flex items-center gap-2">
          <AlertTriangle class="w-4 h-4" />
          {{ issues.length }} Active Issue{{ issues.length !== 1 ? 's' : '' }}
        </span>
        <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': issuesBannerOpen }" />
      </button>
      <div v-if="issuesBannerOpen" class="mt-2 space-y-2">
        <div
          v-for="issue in issues"
          :key="issue.title"
          class="p-3 border-l-4 border-amber-500 bg-white dark:bg-slate-800 rounded-r-lg text-sm"
        >
          <p class="font-semibold text-gray-900 dark:text-gray-100">{{ issue.title }}</p>
          <p class="text-gray-600 dark:text-gray-400 mt-1">{{ issue.brief }}</p>
        </div>
      </div>
    </div>

    <!-- Tier Groups -->
    <div class="space-y-8">
      <TierGroup
        v-for="tier in tiers"
        :key="tier.id"
        :tier="tier"
        :modules="getModulesForTier(tier.id)"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-gray-400 dark:text-gray-500 text-sm">Loading modules...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { AlertTriangle, ChevronDown } from 'lucide-vue-next'
import ProgressBar from './ProgressBar.vue'
import TierGroup from './TierGroup.vue'
import { useContent } from '@/composables/useContent'
import { useProgressStore } from '@/stores/progressStore'

const { loadConfig, loadModules, loadIssues } = useContent()
const progressStore = useProgressStore()

const loading = ref(true)
const tiers = ref([])
const modules = ref([])
const issues = ref([])
const issuesBannerOpen = ref(false)

const progress = computed(() => progressStore.getOverallProgress(modules.value.length))

function getModulesForTier(tierId) {
  return modules.value.filter(m => m.tierId === tierId)
}

onMounted(async () => {
  try {
    const config = await loadConfig()
    tiers.value = config.tiers || []
    modules.value = await loadModules()
    issues.value = await loadIssues()
  } finally {
    loading.value = false
  }
})
</script>
