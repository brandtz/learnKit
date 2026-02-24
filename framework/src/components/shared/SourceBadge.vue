<template>
  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="colorClasses">
    {{ origin }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  origin: { type: String, required: true }
})

const colorMap = {
  'OSBA': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'ORS': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  'OAR': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  'ODE': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'OGEC': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Springfield SD 19': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'Springfield SD': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'Lane ESD': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  'External': 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
  'Oregon Legislature': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  'NCES': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Citizen Portal': 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
}

const colorClasses = computed(() => {
  return colorMap[props.origin] || 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400'
})
</script>
