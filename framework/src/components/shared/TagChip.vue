<template>
  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="colorClasses">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true }
})

const colorMap = {
  'Governance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Foundations': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Meetings': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Robert\'s Rules': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Ethics': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Compliance': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Policy': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'ORS': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  'OAR': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  'Statute': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Regulation': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  'ODE': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'State Structure': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'OSBA': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Resources': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  'Public Meeting Law': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Lane ESD': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  'Services': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  'Regional': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  'Springfield': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'District': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'Board Members': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'Budget': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'Current Issues': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'Vacancy': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Curriculum': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Community': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Agendas': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'Archive': 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
  'Public Conduct': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
}

const colorClasses = computed(() => {
  return colorMap[props.label] || 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400'
})
</script>
