<template>
  <router-link
    :to="`/module/${module.id}`"
    class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    :class="tierBorderClass"
  >
    <!-- Top row: tier badge + status -->
    <div class="flex items-center justify-between">
      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="tierBadgeClasses">
        {{ module.tierId }}
      </span>
      <StatusBadge :status="status" />
    </div>

    <!-- Title -->
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug">
      {{ module.title }}
    </h3>

    <!-- Meta: time + tags -->
    <div class="flex items-center gap-3 flex-wrap">
      <span class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <Clock class="w-3.5 h-3.5" />
        {{ module.estimatedMinutes }} min
      </span>
      <TagChip
        v-for="tag in visibleTags"
        :key="tag"
        :label="tag"
      />
      <span v-if="extraTagCount > 0" class="text-xs text-gray-400 dark:text-gray-500">
        +{{ extraTagCount }} more
      </span>
    </div>

    <!-- CTA -->
    <div class="mt-auto pt-1">
      <span class="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {{ ctaText }}
      </span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import StatusBadge from '../shared/StatusBadge.vue'
import TagChip from '../shared/TagChip.vue'
import { useProgressStore } from '@/stores/progressStore'

const props = defineProps({
  module: { type: Object, required: true },
  tier: { type: Object, default: () => ({}) }
})

const progressStore = useProgressStore()

const status = computed(() => progressStore.getStatus(props.module.id))

const visibleTags = computed(() => (props.module.tags || []).slice(0, 2))
const extraTagCount = computed(() => Math.max(0, (props.module.tags || []).length - 2))

const ctaText = computed(() => {
  switch (status.value) {
    case 'complete': return 'Review ✓'
    case 'in_progress': return 'Continue →'
    default: return 'Start →'
  }
})

const tierBorderClass = computed(() => {
  const map = {
    'T1': 'border-l-4 border-l-blue-600',
    'T2': 'border-l-4 border-l-purple-600',
    'T3': 'border-l-4 border-l-orange-600',
  }
  return map[props.module.tierId] || ''
})

const tierBadgeClasses = computed(() => {
  const map = {
    'T1': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'T2': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'T3': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  }
  return map[props.module.tierId] || map['T1']
})
</script>
