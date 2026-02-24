<template>
  <span :class="classes" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
    <component :is="icon" class="w-3.5 h-3.5" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { Circle, Clock, CheckCircle } from 'lucide-vue-next'

const props = defineProps({
  status: {
    type: String,
    default: 'not_started',
    validator: v => ['not_started', 'in_progress', 'complete'].includes(v)
  }
})

const config = {
  not_started: {
    classes: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400',
    icon: Circle,
    label: 'Not Started'
  },
  in_progress: {
    classes: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Clock,
    label: 'In Progress'
  },
  complete: {
    classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: CheckCircle,
    label: 'Complete'
  }
}

const classes = computed(() => config[props.status]?.classes || config.not_started.classes)
const icon = computed(() => config[props.status]?.icon || Circle)
const label = computed(() => config[props.status]?.label || 'Not Started')
</script>
