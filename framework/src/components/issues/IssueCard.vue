<template>
  <div class="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/10 rounded-r-lg p-4">
    <!-- Priority badge -->
    <div class="flex items-center justify-between mb-2">
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        Priority {{ priority }}
      </span>
      <span class="text-xs text-gray-400 dark:text-gray-500">
        {{ issue.updated || '' }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ issue.title }}</h3>

    <!-- Brief -->
    <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{{ issue.brief }}</p>

    <!-- Citations & links -->
    <div v-if="issue.citations?.length || issue.pressLinks?.length" class="flex flex-wrap gap-3">
      <a
        v-for="(cite, i) in (issue.citations || [])"
        :key="'cite-' + i"
        :href="cite.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-emerald-700 dark:text-emerald-400 hover:underline"
      >
        {{ cite.label }}
        <span class="sr-only">(opens in new tab)</span>
      </a>
      <a
        v-for="(link, i) in (issue.pressLinks || [])"
        :key="'press-' + i"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-emerald-700 dark:text-emerald-400 hover:underline"
      >
        {{ link.label }}
        <span class="sr-only">(opens in new tab)</span>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  issue: { type: Object, required: true },
  priority: { type: Number, default: 1 }
})
</script>
