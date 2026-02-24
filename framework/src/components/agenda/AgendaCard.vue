<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4"
    :class="accentBorderClass"
  >
    <!-- Header row -->
    <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatDate(agenda.date) }}</span>
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          :class="meetingTypeBadge"
        >
          {{ agenda.meetingType }}
        </span>
      </div>
      <a
        v-if="agenda.pdfUrl"
        :href="agenda.pdfUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
      >
        <FileText class="w-3.5 h-3.5" />
        View PDF
        <span class="sr-only">(opens in new tab)</span>
      </a>
    </div>

    <!-- Budget flag -->
    <div v-if="agenda.budgetFlag" class="mb-3 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-800 dark:text-amber-400 font-medium">
      ⚠ Budget discussion
    </div>

    <!-- Top items -->
    <ul v-if="agenda.topItems?.length" class="space-y-1.5 mb-3">
      <li
        v-for="(item, i) in agenda.topItems"
        :key="i"
        class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <CheckCircle class="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
        {{ item }}
      </li>
    </ul>

    <!-- Summary -->
    <p v-if="agenda.summary" class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
      {{ agenda.summary }}
    </p>

    <!-- Tags -->
    <div v-if="agenda.tags?.length" class="flex flex-wrap gap-1">
      <TagChip v-for="tag in agenda.tags" :key="tag" :label="tag" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FileText, CheckCircle } from 'lucide-vue-next'
import TagChip from '../shared/TagChip.vue'

const props = defineProps({
  agenda: { type: Object, required: true }
})

const accentBorderClass = computed(() => {
  const map = {
    'Regular': 'border-l-4 border-l-blue-500',
    'Work Session': 'border-l-4 border-l-amber-500',
    'Special': 'border-l-4 border-l-red-500'
  }
  return map[props.agenda.meetingType] || 'border-l-4 border-l-gray-400'
})

const meetingTypeBadge = computed(() => {
  const map = {
    'Regular': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Work Session': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'Special': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return map[props.agenda.meetingType] || 'bg-gray-100 text-gray-700'
})

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
