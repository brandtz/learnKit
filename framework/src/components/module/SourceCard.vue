<template>
  <div class="bg-gray-50 dark:bg-slate-700/50 rounded-md border border-gray-200 dark:border-slate-600 p-4 flex flex-col gap-2">
    <!-- Top: badge + link icon -->
    <div class="flex items-center justify-between">
      <SourceBadge :origin="source.label" />
      <ExternalLink class="w-4 h-4 text-gray-400 dark:text-gray-500" />
    </div>

    <!-- Title -->
    <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
      {{ source.title || source.label }}
    </h3>

    <!-- Summary -->
    <p v-if="source.summary" class="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
      {{ source.summary }}
    </p>

    <!-- CTA -->
    <a
      :href="source.url"
      target="_blank"
      rel="noopener noreferrer"
      class="text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:underline inline-flex items-center gap-1 mt-auto"
    >
      Open Source →
      <span class="sr-only">(opens in new tab)</span>
    </a>
  </div>
</template>

<script setup>
import { ExternalLink } from 'lucide-vue-next'
import SourceBadge from '../shared/SourceBadge.vue'

defineProps({
  source: { type: Object, required: true }
})
</script>
