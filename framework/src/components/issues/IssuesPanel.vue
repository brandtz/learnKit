<template>
  <div class="max-w-6xl mx-auto">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Current Issues</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Active district issues requiring board attention
      </p>
    </header>

    <div class="space-y-4">
      <IssueCard
        v-for="(issue, i) in issues"
        :key="issue.title"
        :issue="issue"
        :priority="i + 1"
      />
    </div>

    <div v-if="issues.length === 0 && !loading" class="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
      No current issues loaded.
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
      Loading issues...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import IssueCard from './IssueCard.vue'
import { useContent } from '@/composables/useContent'

const { loadIssues } = useContent()

const issues = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    issues.value = await loadIssues()
  } finally {
    loading.value = false
  }
})
</script>
