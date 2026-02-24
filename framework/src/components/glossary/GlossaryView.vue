<template>
  <div class="max-w-6xl mx-auto">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Glossary</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Key governance terms and definitions
      </p>
    </header>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search terms..."
        class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>

    <!-- Alphabetical filter -->
    <div class="mb-6 flex gap-1 flex-wrap">
      <button
        v-for="letter in alphabet"
        :key="letter"
        class="w-8 h-8 flex items-center justify-center rounded text-xs font-medium transition-colors"
        :class="activeLetter === letter
          ? 'bg-emerald-700 text-white'
          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'"
        @click="activeLetter = activeLetter === letter ? null : letter"
      >
        {{ letter }}
      </button>
    </div>

    <!-- Terms -->
    <div class="divide-y divide-gray-100 dark:divide-slate-700">
      <GlossaryTerm
        v-for="term in filteredTerms"
        :key="term.term"
        :term="term"
      />
    </div>

    <div v-if="filteredTerms.length === 0 && !loading" class="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
      No terms match your search.
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
      Loading glossary...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GlossaryTerm from './GlossaryTerm.vue'
import { useContent } from '@/composables/useContent'

const route = useRoute()
const { loadGlossary } = useContent()

const terms = ref([])
const loading = ref(true)
const searchQuery = ref('')
const activeLetter = ref(null)

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const filteredTerms = computed(() => {
  let result = terms.value

  if (activeLetter.value) {
    result = result.filter(t => t.term.toUpperCase().startsWith(activeLetter.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
    )
  }

  return result
})

onMounted(async () => {
  try {
    terms.value = await loadGlossary()
    // Deep link support
    if (route.params.term) {
      searchQuery.value = route.params.term
    }
  } finally {
    loading.value = false
  }
})
</script>
