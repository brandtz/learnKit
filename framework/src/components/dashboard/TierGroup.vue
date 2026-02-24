<template>
  <section>
    <!-- Tier Header -->
    <div class="flex items-center gap-3 mb-4">
      <span
        class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
        :class="tierBadgeClasses"
      >
        {{ tier.id }}
      </span>
      <div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ tier.label }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ tier.description }}</p>
      </div>
    </div>

    <!-- Module Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <ModuleCard
        v-for="mod in modules"
        :key="mod.id"
        :module="mod"
        :tier="tier"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ModuleCard from './ModuleCard.vue'

const props = defineProps({
  tier: { type: Object, required: true },
  modules: { type: Array, default: () => [] }
})

const tierBadgeClasses = computed(() => {
  const map = {
    'T1': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'T2': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'T3': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  }
  return map[props.tier.id] || map['T1']
})
</script>
