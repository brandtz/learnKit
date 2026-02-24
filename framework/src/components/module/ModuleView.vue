<template>
  <div class="max-w-3xl mx-auto" v-if="moduleData">
    <!-- Breadcrumb -->
    <nav class="text-xs text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-1.5">
      <router-link to="/" class="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Dashboard</router-link>
      <ChevronRight class="w-3 h-3" />
      <span>{{ tierLabel }}</span>
      <ChevronRight class="w-3 h-3" />
      <span class="text-gray-700 dark:text-gray-300">{{ moduleData.meta.title }}</span>
    </nav>

    <!-- Module Header -->
    <header class="mb-8">
      <div class="flex items-center gap-3 mb-3 flex-wrap">
        <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold" :class="tierBadgeClasses">
          {{ moduleData.meta.tierId }}
        </span>
        <StatusBadge :status="status" />
        <span class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock class="w-3.5 h-3.5" />
          {{ moduleData.meta.estimatedMinutes }} min
        </span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {{ moduleData.meta.title }}
      </h1>
      <div class="flex flex-wrap gap-2 mt-3">
        <TagChip v-for="tag in moduleData.meta.tags" :key="tag" :label="tag" />
      </div>
    </header>

    <!-- Overview (rendered markdown) -->
    <section class="mb-8">
      <div class="prose dark:prose-invert max-w-none" v-html="moduleData.contentHtml"></div>
    </section>

    <!-- Source Documents -->
    <section v-if="moduleData.meta.sources?.length" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Source Documents</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SourceCard
          v-for="(source, i) in moduleData.meta.sources"
          :key="i"
          :source="source"
        />
      </div>
    </section>

    <!-- Key Takeaways -->
    <section v-if="moduleData.meta.takeaways?.length" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Key Takeaways</h2>
      <ul class="space-y-3">
        <li
          v-for="(takeaway, i) in moduleData.meta.takeaways"
          :key="i"
          class="flex items-start gap-3"
        >
          <CheckCircle class="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          <span class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ takeaway }}</span>
        </li>
      </ul>
    </section>

    <!-- Knowledge Check -->
    <section v-if="moduleData.meta.knowledgeCheck?.length" class="mb-8 knowledge-check">
      <hr class="border-gray-200 dark:border-slate-700 mb-8" />
      <KnowledgeCheck :questions="moduleData.meta.knowledgeCheck" />
    </section>

    <!-- Module Navigation -->
    <ModuleNav
      :current-id="moduleData.meta.id"
      :status="status"
      @mark-complete="markComplete"
    />
  </div>

  <!-- Loading state -->
  <div v-else class="flex items-center justify-center py-20">
    <div class="text-gray-400 dark:text-gray-500 text-sm">Loading module...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRight, Clock, CheckCircle } from 'lucide-vue-next'
import StatusBadge from '../shared/StatusBadge.vue'
import TagChip from '../shared/TagChip.vue'
import SourceCard from './SourceCard.vue'
import KnowledgeCheck from './KnowledgeCheck.vue'
import ModuleNav from './ModuleNav.vue'
import { useContent } from '@/composables/useContent'
import { useProgressStore } from '@/stores/progressStore'

const route = useRoute()
const router = useRouter()
const { loadModule, loadConfig } = useContent()
const progressStore = useProgressStore()

const moduleData = ref(null)
const config = ref(null)

const status = computed(() => moduleData.value ? progressStore.getStatus(moduleData.value.meta.id) : 'not_started')

const tierLabel = computed(() => {
  if (!config.value || !moduleData.value) return ''
  const tier = config.value.tiers.find(t => t.id === moduleData.value.meta.tierId)
  return tier?.label || moduleData.value.meta.tierId
})

const tierBadgeClasses = computed(() => {
  const tierId = moduleData.value?.meta.tierId
  const map = {
    'T1': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'T2': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'T3': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  }
  return map[tierId] || map['T1']
})

async function loadModuleData(id) {
  moduleData.value = null
  config.value = await loadConfig()
  moduleData.value = await loadModule(id)

  // Auto-set to in_progress if not started
  const currentStatus = progressStore.getStatus(id)
  if (currentStatus === 'not_started') {
    progressStore.setStatus(id, 'in_progress')
  }
}

function markComplete() {
  if (moduleData.value) {
    progressStore.setStatus(moduleData.value.meta.id, 'complete')
    router.push('/')
  }
}

onMounted(() => loadModuleData(route.params.id))

watch(() => route.params.id, (newId) => {
  if (newId) loadModuleData(newId)
})
</script>
