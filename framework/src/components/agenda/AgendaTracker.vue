<template>
  <div class="max-w-6xl mx-auto">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Board Meeting Archive</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Springfield SD 19 board meeting agendas — last 24 months
      </p>
    </header>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search agenda summaries..."
        class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>

    <!-- Tag Filters -->
    <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
        :class="activeTag === tag
          ? 'bg-emerald-700 text-white'
          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'"
        @click="activeTag = activeTag === tag ? null : tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Agenda Cards -->
    <div class="space-y-4">
      <AgendaCard
        v-for="agenda in filteredAgendas"
        :key="agenda.date + agenda.meetingType"
        :agenda="agenda"
      />
    </div>

    <div v-if="filteredAgendas.length === 0 && !loading" class="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
      No agendas match your search.
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
      Loading agendas...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AgendaCard from './AgendaCard.vue'
import { useContent } from '@/composables/useContent'

const { loadAgendas } = useContent()

const agendas = ref([])
const loading = ref(true)
const searchQuery = ref('')
const activeTag = ref(null)

const allTags = ['Budget', 'Curriculum', 'Facilities', 'Personnel', 'Policy', 'Special Ed', 'Governance', 'Community']

const filteredAgendas = computed(() => {
  let result = agendas.value

  if (activeTag.value) {
    result = result.filter(a => a.tags?.includes(activeTag.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.summary?.toLowerCase().includes(q) ||
      a.topItems?.some(item => item.toLowerCase().includes(q))
    )
  }

  return result
})

onMounted(async () => {
  try {
    agendas.value = await loadAgendas()
  } finally {
    loading.value = false
  }
})
</script>
